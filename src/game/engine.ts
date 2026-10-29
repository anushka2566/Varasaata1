// Pure Varasaata (Nine Men's Morris style) rules engine. No flying: stones only
// ever move to an adjacent empty point, even with three stones left.

export type Player = 1 | 2;
export type Cell = 0 | Player;

export const STONES_PER_PLAYER = 9;
/** Moves in the movement phase without any capture before the round is a draw. */
export const DRAW_MOVE_LIMIT = 100;

/** Grid coordinates (0..6) for each of the 24 points. */
export const COORDS: [number, number][] = [
  [0, 0],
  [3, 0],
  [6, 0],
  [1, 1],
  [3, 1],
  [5, 1],
  [2, 2],
  [3, 2],
  [4, 2],
  [0, 3],
  [1, 3],
  [2, 3],
  [4, 3],
  [5, 3],
  [6, 3],
  [2, 4],
  [3, 4],
  [4, 4],
  [1, 5],
  [3, 5],
  [5, 5],
  [0, 6],
  [3, 6],
  [6, 6],
];

export const ADJACENT: number[][] = [
  [1, 9],
  [0, 2, 4],
  [1, 14],
  [4, 10],
  [1, 3, 5, 7],
  [4, 13],
  [7, 11],
  [4, 6, 8],
  [7, 12],
  [0, 10, 21],
  [3, 9, 11, 18],
  [6, 10, 15],
  [8, 13, 17],
  [5, 12, 14, 20],
  [2, 13, 23],
  [11, 16],
  [15, 17, 19],
  [12, 16],
  [10, 19],
  [16, 18, 20, 22],
  [13, 19],
  [9, 22],
  [19, 21, 23],
  [14, 22],
];

export const MILLS: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10, 11],
  [12, 13, 14],
  [15, 16, 17],
  [18, 19, 20],
  [21, 22, 23],
  [0, 9, 21],
  [3, 10, 18],
  [6, 11, 15],
  [1, 4, 7],
  [16, 19, 22],
  [8, 12, 17],
  [5, 13, 20],
  [2, 14, 23],
];

export type EndReason = "stones" | "blocked" | "timeout" | "draw";

export interface GameState {
  board: Cell[];
  turn: Player;
  inHand: [number, number];
  captured: [number, number]; // stones each player has captured
  pendingCapture: boolean;
  quietMoves: number;
  winner: Player | 0 | null; // 0 = draw
  endReason: EndReason | null;
  lastMove: { from?: number; to?: number; captured?: number } | null;
  /** Mill keys each player broke with their last move. */
  brokenMills: [string[], string[]];
  /** The mill authorized for the pending capture, and mills already used this match. */
  pendingMills: string[];
  usedMills: string[];
}

export const other = (p: Player): Player => (p === 1 ? 2 : 1);

/** Map a uniform random sample in [0, 1) to equal starting chances. */
export const startingPlayer = (sample: number): Player => (sample < 0.5 ? 1 : 2);

export function createGame(starter: Player = 1, usedMills: string[] = []): GameState {
  return {
    board: Array(24).fill(0) as Cell[],
    turn: starter,
    inHand: [STONES_PER_PLAYER, STONES_PER_PLAYER],
    captured: [0, 0],
    pendingCapture: false,
    quietMoves: 0,
    winner: null,
    endReason: null,
    lastMove: null,
    brokenMills: [[], []],
    pendingMills: [],
    usedMills: usedMills.slice(),
  };
}

export const hand = (s: GameState, p: Player) => s.inHand[p - 1];
export const onBoard = (s: GameState, p: Player) => s.board.filter((c) => c === p).length;
export const phaseOf = (s: GameState, p: Player): "place" | "move" =>
  hand(s, p) > 0 ? "place" : "move";

export function isInMill(board: Cell[], pos: number): boolean {
  const p = board[pos];
  if (!p) return false;
  return MILLS.some((m) => m.includes(pos) && m.every((i) => board[i] === p));
}

/** Opponent stones that may legally be captured right now. */
export function capturable(s: GameState): number[] {
  const opp = other(s.turn);
  const theirs = s.board.flatMap((c, i) => (c === opp ? [i] : []));
  const free = theirs.filter((i) => !isInMill(s.board, i));
  return free.length > 0 ? free : theirs;
}

export function movesFrom(s: GameState, from: number): number[] {
  if (s.board[from] !== s.turn) return [];
  return ADJACENT[from].filter((j) => s.board[j] === 0);
}

export function hasLegalMove(s: GameState, p: Player): boolean {
  if (hand(s, p) > 0) return s.board.some((c) => c === 0);
  return s.board.some((c, i) => c === p && ADJACENT[i].some((j) => s.board[j] === 0));
}

function finishTurn(s: GameState): GameState {
  const next = other(s.turn);
  const n: GameState = { ...s, turn: next, pendingCapture: false, pendingMills: [] };
  if (onBoard(n, next) + hand(n, next) < 3) return { ...n, winner: s.turn, endReason: "stones" };
  if (!hasLegalMove(n, next)) return { ...n, winner: s.turn, endReason: "blocked" };
  if (n.quietMoves >= DRAW_MOVE_LIMIT) return { ...n, winner: 0, endReason: "draw" };
  return n;
}

const millKey = (m: readonly number[]) =>
  m
    .slice()
    .sort((a, b) => a - b)
    .join("-");

function afterPlacing(s: GameState, pos: number, broken: string[] = []): GameState {
  const brokenMills = s.brokenMills.slice() as [string[], string[]];
  brokenMills[s.turn - 1] = broken;
  const n = { ...s, brokenMills };
  const formed = MILLS.filter((m) => m.includes(pos) && m.every((i) => n.board[i] === n.turn))
    .map(millKey)
    .filter((key) => !s.brokenMills[s.turn - 1].includes(key) && !s.usedMills.includes(key));
  if (formed.length > 0 && n.board.some((c) => c === other(n.turn))) {
    return { ...n, pendingCapture: true, pendingMills: [formed[0]] };
  }
  return finishTurn(n);
}

export class IllegalMoveError extends Error {}

export function place(s: GameState, pos: number): GameState {
  if (s.winner !== null || s.pendingCapture) throw new IllegalMoveError("Not allowed now");
  if (hand(s, s.turn) <= 0) throw new IllegalMoveError("No stones in hand");
  if (s.board[pos] !== 0) throw new IllegalMoveError("Point occupied");
  const board = s.board.slice();
  board[pos] = s.turn;
  const inHand = s.inHand.slice() as [number, number];
  inHand[s.turn - 1] -= 1;
  return afterPlacing({ ...s, board, inHand, lastMove: { to: pos } }, pos, []);
}

export function move(s: GameState, from: number, to: number): GameState {
  if (s.winner !== null || s.pendingCapture) throw new IllegalMoveError("Not allowed now");
  if (hand(s, s.turn) > 0) throw new IllegalMoveError("Place all stones first");
  if (s.board[from] !== s.turn) throw new IllegalMoveError("Not your stone");
  if (!ADJACENT[from].includes(to))
    throw new IllegalMoveError("Stones move only to adjacent points");
  if (s.board[to] !== 0) throw new IllegalMoveError("Point occupied");
  const broken = MILLS.filter((m) => m.includes(from) && m.every((i) => s.board[i] === s.turn)).map(
    millKey,
  );
  const board = s.board.slice();
  board[from] = 0;
  board[to] = s.turn;
  return afterPlacing(
    { ...s, board, quietMoves: s.quietMoves + 1, lastMove: { from, to } },
    to,
    broken,
  );
}

export function capture(s: GameState, pos: number): GameState {
  if (!s.pendingCapture || s.winner !== null) throw new IllegalMoveError("No capture pending");
  if (!capturable(s).includes(pos)) throw new IllegalMoveError("That stone is protected by a mill");
  const board = s.board.slice();
  board[pos] = 0;
  const captured = s.captured.slice() as [number, number];
  captured[s.turn - 1] += 1;
  const usedMills = [...s.usedMills, ...s.pendingMills];
  return finishTurn({
    ...s,
    board,
    captured,
    quietMoves: 0,
    usedMills,
    lastMove: { ...s.lastMove, captured: pos },
  });
}

/** End the round because the current player ran out of time. */
export function timeout(s: GameState): GameState {
  if (s.winner !== null) return s;
  return { ...s, winner: other(s.turn), endReason: "timeout", pendingCapture: false };
}

// ---------- compound moves for the AI ----------
export interface FullMove {
  from?: number;
  to: number;
  capture?: number;
}

export function fullMoves(s: GameState): FullMove[] {
  if (s.winner !== null) return [];
  const steps: { st: GameState; m: FullMove }[] = [];
  if (hand(s, s.turn) > 0) {
    s.board.forEach((c, i) => {
      if (c === 0) steps.push({ st: place(s, i), m: { to: i } });
    });
  } else {
    s.board.forEach((c, i) => {
      if (c !== s.turn) return;
      for (const j of ADJACENT[i])
        if (s.board[j] === 0) steps.push({ st: move(s, i, j), m: { from: i, to: j } });
    });
  }
  const out: FullMove[] = [];
  for (const { st, m } of steps) {
    if (st.pendingCapture) for (const c of capturable(st)) out.push({ ...m, capture: c });
    else out.push(m);
  }
  return out;
}

export function applyFull(s: GameState, m: FullMove): GameState {
  let n = m.from === undefined ? place(s, m.to) : move(s, m.from, m.to);
  if (n.pendingCapture && m.capture !== undefined) n = capture(n, m.capture);
  return n;
}
