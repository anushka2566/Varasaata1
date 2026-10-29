import {
  ADJACENT,
  MILLS,
  applyFull,
  fullMoves,
  hand,
  onBoard,
  other,
  type FullMove,
  type GameState,
  type Player,
} from "./engine";

export type Difficulty = "easy" | "normal" | "hard" | "master";

function evaluate(s: GameState, me: Player): number {
  if (s.winner === me) return 10000;
  if (s.winner === other(me)) return -10000;
  if (s.winner === 0) return 0;
  const opp = other(me);
  let score = (onBoard(s, me) + hand(s, me) - onBoard(s, opp) - hand(s, opp)) * 35;
  for (const m of MILLS) {
    const mine = m.filter((i) => s.board[i] === me).length;
    const theirs = m.filter((i) => s.board[i] === opp).length;
    const empty = 3 - mine - theirs;
    if (mine === 3) score += 12;
    if (theirs === 3) score -= 14;
    if (mine === 2 && empty === 1) score += 7;
    if (theirs === 2 && empty === 1) score -= 9;
  }
  let mob = 0;
  s.board.forEach((c, i) => {
    if (c === 0) return;
    const free = ADJACENT[i].filter((j) => s.board[j] === 0).length;
    mob += c === me ? free : -free;
  });
  return score + mob * 2;
}

function minimax(s: GameState, depth: number, alpha: number, beta: number, me: Player): number {
  if (depth === 0 || s.winner !== null) return evaluate(s, me) + (s.winner !== null ? depth : 0);
  const moves = fullMoves(s);
  const maximizing = s.turn === me;
  let best = maximizing ? -Infinity : Infinity;
  for (const m of moves) {
    const v = minimax(applyFull(s, m), depth - 1, alpha, beta, me);
    if (maximizing) {
      best = Math.max(best, v);
      alpha = Math.max(alpha, v);
    } else {
      best = Math.min(best, v);
      beta = Math.min(beta, v);
    }
    if (beta <= alpha) break;
  }
  return best;
}

export function chooseMove(
  s: GameState,
  difficulty: Difficulty,
  rng: () => number = Math.random,
): FullMove | null {
  const moves = fullMoves(s);
  if (moves.length === 0) return null;
  const me = s.turn;
  const pick = <T>(arr: T[]) => arr[Math.floor(rng() * arr.length)];

  if (difficulty === "easy") {
    // Mostly random; takes an obvious mill only 35% of the time.
    const mills = moves.filter((m) => m.capture !== undefined);
    if (mills.length && rng() < 0.35) return pick(mills);
    return pick(moves);
  }

  // Determine search depth based on stage and difficulty
  let depth = 1;
  if (difficulty === "normal") {
    depth = 2;
  } else if (difficulty === "hard") {
    depth = moves.length > 35 ? 2 : 3;
  } else if (difficulty === "master") {
    depth = moves.length > 30 ? 3 : 4;
  }

  let bestScore = -Infinity;
  let best: FullMove[] = [];
  for (const m of moves) {
    const nextState = applyFull(s, m);
    let v = minimax(nextState, depth - 1, -Infinity, Infinity, me);
    // Prioritize winning / mill moves immediately
    if (m.capture !== undefined) v += 5;
    if (v > bestScore) {
      bestScore = v;
      best = [m];
    } else if (v === bestScore) {
      best.push(m);
    }
  }
  return pick(best);
}
