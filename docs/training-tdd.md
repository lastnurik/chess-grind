# Training interface TDD record — ticket #1

Interface: `TrainingSession(course, { lineIndex, mode, startPly })`, `snapshot()`, `play()`, `advanceOpponent()`, `hint()`, `solve()` and `describeMove()`. Confirmed through the user-selected development scope. Real vendored chess.js; no chess behavior mocks.

Each row was implemented as one red → green slice, running the complete training file after each addition:

| Behavior added | Observed red | Green after implementation |
| --- | --- | --- |
| Correct learner move advances position | Module missing (`ERR_MODULE_NOT_FOUND`) | 1/1 |
| Legal alternative rejected without mutation | d4 changed the initial FEN | 2/2 |
| Illegal move rejected with feedback | chess.js threw `Invalid move` | 3/3 |
| Explicit single opponent reply | `advanceOpponent is not a function` | 4/4 |
| Learner cannot play pending opponent reply | e5 incorrectly changed the position | 5/5 |
| Completion is stable | Further d4 input increased mistakes | 6/6 |
| Progressive hint and reset | `hint is not a function` | 7/7 |
| Solve learner move, never opponent move | `solve is not a function` | 8/8 |
| Puzzle start ply and black side | Initial ply was 0 instead of 2 | 9/9 |
| Invalid course rejected upfront | Missing expected exception for broken line | 10/10 |
| Castling/promotion coaching | `Play king to g1.` instead of castling instruction | 11/11 |
| Preserve selected mode in snapshots (integration fix) | `undefined` instead of `Drill` | 14/14 including regression checks |

Additional regression verification of existing chess.js-backed behavior: castling relocates the rook, en passant removes the pawn, wrong promotion is rejected and expected knight underpromotion succeeds, and mutations to returned snapshots/source objects do not change the session. These already passed; no artificial red was manufactured.

Final validation:

- `node tests/training.test.mjs`: **14 tests passed**.
- `node --test tests/training.test.mjs`: successful. In the restricted executor this runner reports the file as one passing subprocess; direct execution shows individual behavior names.
- `node --check src/training.mjs`: successful.

Scope notes: mode-dependent presentation and timed-session behavior belong to the UI/review ticket. The training interface preserves the mode option in snapshots while keeping move legality, hint accounting and line progression consistent across modes. Opponent replies remain explicit for UI animation and cancellation when changing sessions. The module does not start timers or run an engine.
