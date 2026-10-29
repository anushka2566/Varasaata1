import { COORDS, MILLS, isInMill, type GameState } from "@/game/engine";

export const STONE_COLORS = ["emerald", "ruby", "sapphire", "gold", "ivory", "onyx"] as const;
export type StoneColor = (typeof STONE_COLORS)[number];
export const stoneBg = (c: string) => `var(--stone-${c})`;

const pct = (n: number) => `${(n / 6) * 100}%`;

interface Props {
  state: GameState;
  colors: [string, string];
  selected: number | null;
  targets: number[];
  capturable: number[];
  animate: boolean;
  disabled: boolean;
  onPoint: (i: number) => void;
}

export function Board({
  state,
  colors,
  selected,
  targets,
  capturable,
  animate,
  disabled,
  onPoint,
}: Props) {
  // Base grid lines
  const lines: [number, number, number, number][] = MILLS.map((m) => {
    const a = COORDS[m[0]],
      b = COORDS[m[2]];
    return [a[0], a[1], b[0], b[1]];
  });

  // Identify active mills on the board for glowing lines
  const activeMills = MILLS.filter(
    (m) =>
      state.board[m[0]] !== 0 &&
      state.board[m[0]] === state.board[m[1]] &&
      state.board[m[1]] === state.board[m[2]],
  );

  return (
    <div className="bg-board relative aspect-square w-full max-w-[min(92vw,30rem)] rounded-2xl p-[7%] transition-all duration-300 shadow-2xl">
      <div className="relative h-full w-full">
        {/* Board grid SVG */}
        <svg
          viewBox="0 0 6 6"
          className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
          aria-hidden
        >
          <defs>
            <filter id="mill-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.12" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background track lines */}
          {lines.map(([x1, y1, x2, y2], i) => (
            <line
              key={`base-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--board-line)"
              strokeWidth={0.065}
              strokeLinecap="round"
            />
          ))}

          {/* Active mill glowing lines */}
          {activeMills.map((m, i) => {
            const a = COORDS[m[0]];
            const b = COORDS[m[2]];
            return (
              <line
                key={`mill-${i}`}
                x1={a[0]}
                y1={a[1]}
                x2={b[0]}
                y2={b[1]}
                stroke="oklch(0.85 0.18 85)"
                strokeWidth={0.11}
                strokeLinecap="round"
                filter="url(#mill-glow)"
                className="opacity-80 animate-pulse"
              />
            );
          })}
        </svg>

        {/* Intersection points & Stones */}
        {COORDS.map(([x, y], i) => {
          const c = state.board[i];
          const isTarget = targets.includes(i);
          const isCap = capturable.includes(i);
          const isLast = state.lastMove?.to === i;
          const isSelected = selected === i;
          const inMill = isInMill(state.board, i);

          const label = c
            ? `Point ${i + 1}, player ${c} stone${inMill ? " in a mill" : ""}`
            : `Point ${i + 1}, empty`;

          return (
            <button
              key={i}
              type="button"
              aria-label={label}
              disabled={disabled}
              onClick={() => onPoint(i)}
              className="absolute flex h-[14%] w-[14%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{ left: pct(x), top: pct(y) }}
            >
              {c ? (
                <span
                  key={`${i}-${c}`}
                  className={`absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-stone transition-all duration-200 ${
                    animate ? "animate-stone-in" : ""
                  } ${isSelected ? "ring-4 ring-primary scale-110 z-20 shadow-lg" : ""} ${
                    isCap
                      ? "animate-pulse-ring ring-4 ring-destructive/90 scale-105 cursor-pointer z-20"
                      : ""
                  } ${
                    isLast && !isCap && !isSelected
                      ? "ring-2 ring-primary/80 ring-offset-1 ring-offset-transparent"
                      : ""
                  } ${inMill && !isSelected && !isCap ? "ring-2 ring-amber-300/70" : ""}`}
                  style={{ background: stoneBg(colors[c - 1]) }}
                >
                  {/* Subtle specular glint highlight on stone */}
                  <span className="absolute top-[18%] left-[24%] h-[24%] w-[28%] rounded-full bg-white/40 blur-[0.5px] pointer-events-none" />
                </span>
              ) : (
                <span
                  className={`rounded-full transition-all duration-200 ${
                    isTarget
                      ? "h-[50%] w-[50%] animate-pulse-ring bg-amber-400 ring-4 ring-amber-300/40 shadow-md cursor-pointer"
                      : "h-[30%] w-[30%] hover:scale-125"
                  }`}
                  style={isTarget ? undefined : { background: "var(--board-point)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
