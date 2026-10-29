import { describe, expect, it } from "vitest";
import {
  capture,
  capturable,
  createGame,
  startingPlayer,
  move,
  place,
  IllegalMoveError,
  type GameState,
  type Cell,
} from "./engine";
import { chooseMove } from "./ai";

function withBoard(cells: Record<number, Cell>, patch: Partial<GameState> = {}): GameState {
  const s = createGame();
  const board = s.board.slice();
  for (const [k, v] of Object.entries(cells)) board[Number(k)] = v;
  return { ...s, board, inHand: [0, 0], ...patch };
}

describe("Varasaata rules", () => {
  it("gives each player exactly half the starting chances in either game mode", () => {
    const starters = Array.from({ length: 1000 }, (_, i) => startingPlayer((i + 0.5) / 1000));
    expect(starters.filter((p) => p === 1)).toHaveLength(500);
    expect(starters.filter((p) => p === 2)).toHaveLength(500);
    expect(startingPlayer(0)).toBe(1);
    expect(startingPlayer(0.499999)).toBe(1);
    expect(startingPlayer(0.5)).toBe(2);
    expect(startingPlayer(0.999999)).toBe(2);
    for (const starter of [1, 2] as const) {
      const opening = place(createGame(starter), 0);
      expect(opening.board[0]).toBe(starter);
      expect(opening.turn).toBe(starter === 1 ? 2 : 1);
    }
  });

  it("starts with 9 stones each and 24 empty points", () => {
    const s = createGame();
    expect(s.inHand).toEqual([9, 9]);
    expect(s.board).toHaveLength(24);
  });

  it("forming a mill during placement asks for a capture", () => {
    let s = createGame();
    s = place(s, 0);
    s = place(s, 9);
    s = place(s, 1);
    s = place(s, 10);
    s = place(s, 2);
    expect(s.pendingCapture).toBe(true);
    expect(s.turn).toBe(1);
  });

  it("protects stones in a mill unless every opponent stone is in a mill", () => {
    const s = withBoard(
      { 0: 1, 1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 9: 2 },
      { turn: 1, pendingCapture: true },
    );
    expect(capturable({ ...s, turn: 1 })).toEqual([9]);
    expect(() => capture(s, 3)).toThrow(IllegalMoveError);
    const all = withBoard({ 0: 1, 1: 1, 2: 1, 3: 2, 4: 2, 5: 2 }, { pendingCapture: true });
    expect(capturable(all).sort()).toEqual([3, 4, 5]);
  });

  it("never allows flying, even with three stones", () => {
    const s = withBoard({ 0: 1, 4: 1, 22: 1, 23: 2, 20: 2, 18: 2, 7: 2 }, { turn: 1 });
    expect(() => move(s, 0, 23)).toThrow(IllegalMoveError);
    expect(() => move(s, 0, 12)).toThrow(IllegalMoveError);
    expect(move(s, 0, 1).board[1]).toBe(1);
  });

  it("a mill that already earned a capture cannot earn another later", () => {
    const s = withBoard({ 0: 1, 1: 1, 10: 1, 14: 1, 9: 2, 20: 2, 22: 2, 23: 2 }, { turn: 1 });
    let n = move(s, 14, 2);
    expect(n.pendingCapture).toBe(true);
    n = capture(n, 9);
    expect(n.usedMills).toContain("0-1-2");

    const nextRound = createGame(2, n.usedMills);
    expect(nextRound.usedMills).toEqual(["0-1-2"]);
    expect(createGame().usedMills).toEqual([]);

    n = move(n, 20, 19);
    n = move(n, 1, 4);
    n = move(n, 19, 20);
    n = move(n, 10, 11);
    n = move(n, 20, 19);
    n = move(n, 4, 1);
    expect(n.pendingCapture).toBe(false);
    expect(n.turn).toBe(2);
  });

  it("does not let either player reuse a mill already used in the match", () => {
    const s = withBoard(
      { 0: 2, 1: 2, 14: 2, 9: 1, 20: 1, 22: 1, 23: 1 },
      { turn: 2, usedMills: ["0-1-2"] },
    );
    const n = move(s, 14, 2);
    expect(n.pendingCapture).toBe(false);
    expect(n.usedMills).toEqual(["0-1-2"]);
  });

  it("uses one newly formed mill for a capture even when a move closes two", () => {
    const s = withBoard({ 1: 1, 3: 1, 5: 1, 7: 1, 9: 2 }, { turn: 1, inHand: [1, 0] });
    const pending = place(s, 4);
    expect(pending.pendingMills).toEqual(["3-4-5"]);
    expect(pending.usedMills).toEqual([]);

    const done = capture(pending, 9);
    expect(done.usedMills).toEqual(["3-4-5"]);
  });

  it("does not award a capture for immediately re-closing a broken mill", () => {
    // P1 mill on 0,1,2 plus a spare stone at 9; P2 stones at 20,21,22,23 (mill) and 14.
    const s = withBoard({ 0: 1, 1: 1, 2: 1, 9: 1, 14: 2, 20: 2, 21: 2, 22: 2, 23: 2 }, { turn: 1 });
    // Break the mill: 1 -> 4 (adjacent, empty). No mill formed, turn passes.
    let n = move(s, 1, 4);
    expect(n.pendingCapture).toBe(false);
    // P2 moves harmlessly: 14 -> 13 (adjacent, empty).
    n = move(n, 14, 13);
    // P1 slides straight back: 4 -> 1 re-closes 0-1-2, but it was just broken.
    n = move(n, 4, 1);
    expect(n.pendingCapture).toBe(false);
    expect(n.turn).toBe(2);
  });

  it("closing a different mill after breaking one still earns a capture", () => {
    // P1: mill 0,1,2 plus 6,7,12 (one away from mill 6,7,8). P2: 14 spare, mill 20,21,22? use 20,22,23 non-mill + 14.
    const s = withBoard(
      { 0: 1, 1: 1, 2: 1, 6: 1, 7: 1, 12: 1, 14: 2, 20: 2, 22: 2, 23: 2 },
      { turn: 1 },
    );
    let n = move(s, 1, 4); // break mill 0-1-2
    n = move(n, 14, 13); // P2 harmless move
    n = move(n, 12, 8); // form a different mill: 6,7,8
    expect(n.pendingCapture).toBe(true);
    expect(capturable(n).sort((a, b) => a - b)).toEqual([13, 20, 22, 23]);
  });

  it("wins when the opponent drops below three stones", () => {
    const s = withBoard({ 0: 1, 1: 1, 9: 1, 21: 1, 23: 2, 14: 2, 5: 2 }, { turn: 1 });
    // move 9 -> 10? form mill 0,1,2 by moving 14? use 21->22? Make a mill: 0,9,21 already there; move 1 -> 2 and back not mill.
    const m = move(
      { ...s, board: s.board.map((c, i) => (i === 9 ? 0 : i === 10 ? 1 : c)) as Cell[] },
      10,
      9,
    );
    expect(m.pendingCapture).toBe(true);
    const done = capture(m, 5);
    expect(done.winner).toBe(1);
    expect(done.endReason).toBe("stones");
  });

  it("wins when the opponent has no legal moves", () => {
    // Player 2 stone at 0 surrounded by player 1 at 1 and 9 (blocked); P2 other stones blocked too.
    const s = withBoard({ 0: 2, 2: 2, 21: 2, 1: 1, 9: 1, 14: 1, 22: 1, 4: 1, 3: 0 }, { turn: 1 });
    const n = move(s, 4, 3);
    expect(n.winner).toBe(1);
    expect(n.endReason).toBe("blocked");
  });

  it("AI on every difficulty returns a legal move", () => {
    for (const d of ["easy", "normal", "hard"] as const) {
      const m = chooseMove(createGame(), d);
      expect(m).not.toBeNull();
    }
  });

  it("normal AI completes an available mill", () => {
    const s: GameState = {
      ...createGame(2),
      board: createGame().board.map((_, i) =>
        i === 0 || i === 1 ? 2 : i === 23 ? 1 : 0,
      ) as Cell[],
      inHand: [8, 7],
    };
    expect(chooseMove(s, "normal")?.to).toBe(2);
  });
});
