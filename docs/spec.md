# Chess Grind specification

Status: Accepted with user-selected sequencing: core trainer, then engine, then repertoire tools and review modes. Public test interfaces and per-task commits confirmed through the development-scope selection.

## Problem Statement

The learner wants ChessReps' learning experience locally, without trial limitations, with branching opening lines, meaningful strategy instruction, and a genuine chess engine. They have permission to recreate the interface for private, noncommercial use.

## Solution

Chess Grind recreates the observed catalog and board-centered trainer, with free local learning modes, original teaching, public-domain opening sequences, PGN import, persistent review scheduling, a repertoire creator and local Stockfish. The project is kept in a private GitHub repository with SSH Git operations. No deployment.

## User Stories

1. As a learner, I want to browse opening courses with board previews, so I can choose a repertoire.
2. As a learner, I want to search by opening name or moves, so I can find a specific line.
3. As a learner, I want white/black filtering, so I can build both sides of my repertoire.
4. As a learner, I want the familiar ChessReps layout and interactions, so training feels the same.
5. As a learner, I want the app called Chess Grind throughout.
6. As a learner, I want to choose Essentials, Advanced or Full Mastery, so I can control training depth.
7. As a learner, I want to select specific branching lines, so I can train responses to different moves.
8. As a learner, I want legal click and drag board input, so I can play naturally. Mouse, pen and touch dragging move the actual piece under the pointer without a browser drag image; cancelled or off-board drops restore the piece, and click/keyboard input remains available.
9. As a learner, I want the opponent to reply automatically, so I can focus on my side.
10. As a learner, I want original coach notes explaining plans and pawn structures, so I understand moves.
11. As a learner, I want wrong moves rejected with helpful feedback, so mistakes do not corrupt the line.
12. As a learner, I want progressive hints and a solve control, so I can recover when stuck.
13. As a learner, I want to review past moves and flip the board, so I can inspect positions.
14. As a learner, I want a completion summary and next-line action, so training continues smoothly.
15. As a learner, I want practice scheduled from my performance, so weak lines return sooner.
16. As a learner, I want drill and timed recall, so I can test memory without seeing answers.
17. As a learner, I want opening tactics puzzles, so I can train tactical consequences.
18. As a learner, I want to play against a real engine, so I can practice beyond memorized theory.
19. As a learner, I want live engine evaluation and principal variation, so I can explore alternatives.
20. As a learner, I want strategy courses on development, central breaks and pawn structures.
21. As a learner, I want PGN import with recursive variations and comments, so I can train my own material.
22. As a learner, I want to make and save a course from moves played on the board.
23. As a learner, I want progress and preferences saved locally across reloads.
24. As a learner, I want export/import backup, so I can preserve courses and progress.
25. As a learner, I want board themes, sound, notes and arrow settings.
26. As a learner, I want usable mobile and desktop layouts and accessible board controls.
27. As a learner, I want honest source notes distinguishing factual opening data, original teaching and literature references.
28. As the owner, I want a private GitHub repo with SSH and one commit per completed ticket.
29. As the owner, I want test-first agentic implementation and separate Standards and Spec reviews.

## Implementation Decisions

- Static local app with native JavaScript modules and a loopback-only Python server; no build/dependency installation required.
- Vendored chess.js manages every board and move. Vendored Stockfish lite single-threaded WebAssembly provides actual evaluation and engine play in a worker.
- The catalog is generated from public-domain Lichess opening entries with curated main lines and original plans. The full factual database remains searchable/importable.
- Training encapsulates session position, expected moves, user side, mode, errors, hints, navigation and completion. UI renders state and invokes this interface.
- PGN importer expands recursive annotation variations into independent trainable lines, preserving comments, start FEN and invalid-input errors.
- Progress encapsulates versioned local persistence, review scheduling and validated backup import/export. Inject time/storage for deterministic tests.
- Engine encapsulates UCI lifecycle, serialized/cancelled searches, position-linked results and availability/error state.
- UI follows directly observed reference behavior: dark page, Nunito headings, tan Staunty board, white coach bubble, purple Learn button, mode grid, line/course dropdowns, settings, depth dialog, evaluation strip and navigation.
- All core training modes free. Account/payment/community network flows are replaced with local equivalents; no fake online population or GM attribution.
- Specific paid modes not accessible from the reference are functional local implementations; record that parity is unverified there.

## Testing Decisions

- Proposed scope: highest useful public interfaces for training, PGN import, progress and engine, plus browser end-to-end checks.
- Test real behavior: rejected wrong move retains position, correct move advances, opponent reply works, promotion/castling legal, nested branches yield known sequences, bad import preserves data, due dates change with performance, stale engine results cannot alter a new position.
- Real chess.js; real Stockfish smoke validation. Fake only external storage/time or worker transport where necessary.
- One failing behavior test, implement, rerun green, then next behavior. No bulk imagined tests or private-state assertions.
- Browser QA: catalog/search/filter, depth selection, complete a line, mistake/hint, settings, engine analysis/play, import/create, reload persistence, mobile layout.
- No prior authored tests in this new repository. Use Node's built-in test runner; no new test dependencies.

## Out of Scope

Public deployment, commercial use, accounts, subscriptions, multiplayer, reproducing inaccessible paid course annotations, pretending to have read entire books, or claiming unobserved flows are identical.

## Further Notes

References inspected: ChessReps homepage, Italian Game trainer (initial dialog, Learn, hint, automatic reply, line list, mode dropdown, settings). Free trial restricts additional reference lines/modes. Literature sources: official samples/product material for Fundamental Chess Openings (Paul van der Sterren), Mastering Opening Strategy (Johan Hellsten), Chess Structures (Mauricio Flores Rios). Teaching text must be original and engine-checked where tactical claims are made.
