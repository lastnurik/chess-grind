# Piece dragging correction

User request: move chess pieces directly instead of showing the browser's image drag preview; commit and push the fix.

Cause: occupied square buttons used native HTML drag-and-drop, which renders a browser drag image while the original piece stays in place.

The board now uses pointer capture and translates the original SVG while dragging. Drops use board hit-testing and the existing session move/promotion validation. Pointer cancellation, lost capture, off-board drops and changed positions restore the original presentation. Taps and keyboard square activation remain supported; synthetic clicks after a drag are suppressed.

## Red/green evidence

Public boundary: board input, within the previously agreed browser-flow testing scope. The Node harness substitutes browser event/layout APIs and uses real chess.js for moves.

- `node tests/board.test.mjs` initially failed because dragging e2 toward e4 never translated the piece.
- After pointer dragging was implemented, the same behavior passed.
- A second failing case exposed click retargeting under pointer capture: taps did not select a square. Handling taps at pointer release fixed it.
- All nine board cases pass: drag/drop, captured tap, cancellation, lost capture, off-board release, stale positions/other pointers, native drag blocking/keyboard activation, illegal moves and touch input.
- `npm test`, `npm run check` and `git diff --check` pass.

Independent Standards and Spec reviewers found no blocking issues. Spec review requested more cancellation and touch coverage; these cases were added. Browser layout and native pointer capture have not been visually verified in this session because no browser session is connected.
