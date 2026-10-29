<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Project rules

- Game rules live in pure functions in `src/game/engine.ts` (tested in `engine.test.ts`); UI never mutates board state directly — keeps rules testable and undo a simple snapshot stack.
- Signed-in pages live under `src/routes/_authenticated/`; `/play` additionally requires a consent row for the current policy versions in `src/lib/policies.ts` — consent is server-enforced, never a localStorage flag.
- Strict index-access TS flags are disabled in tsconfig to keep board-array code readable.
