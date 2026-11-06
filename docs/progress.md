# Delivery record

## Accepted ticket breakdown

1. Catalog → legal coached opening session. Blocked by: none. Delivers browse/filter/select/depth/play/hint/completion, original course plans and legal repertoire data.
2. Position → local Stockfish analysis and arena. Blocked by: 1. Delivers real evaluation/PV and engine opponent with safe search cancellation.
3. Own repertoire → PGN import and course creation. Blocked by: 1,2 (user-selected sequence). Delivers import variations/comments and create/save/retrain custom lines.
4. Completed line → saved spaced review and memory modes. Blocked by: 1,2 (user-selected sequence). Delivers persistence, practice/drill/time/puzzles, settings, progress and backup.
5. End-to-end parity, integration and release. Blocked by: 2,3,4. Delivers browser verification, fixes, documentation and two-axis independent reviews.

Each ticket receives its own commit after validation. Parent owns Git commits/pushes and issue state.

## Prepared inputs

- 3,865 opening entries, public-domain Lichess dataset.
- chess.js 1.4.0 BSD and Stockfish 19 lite single-threaded GPLv3, vendored.
- Reference font and Staunty piece sprite obtained from rendered ChessReps UI.
- Private GitHub repo created; origin uses SSH. Push verification pending.
