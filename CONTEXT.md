# Chess Grind

A private, local-only chess opening and strategy trainer modeled on ChessReps' visible UX. No deployment, commercial use, accounts, billing, or hosted data. Repository: lastnurik/chess-grind, private, SSH Git.

## Glossary

- Course: named opening repertoire or strategy curriculum, with a training side, original introduction, plans and branching lines.
- Line: a legal sequence of SAN moves, its start FEN, title, and optional notes keyed by ply.
- Session: a learner's current line, mode, board position, feedback, mistakes, hints and completion.
- Learn: play the chosen side with explanations; opponent replies automatically.
- Practice: spaced review of learned lines, retaining error and hint history.
- Drill: repeat a line from memory with limited coaching.
- Time: timed line recall.
- Puzzles: solve tactical positions derived from curated opening sequences.
- Arena: play a real game against local Stockfish, optionally starting from an opening position.
- Progress: browser-local versioned records of completed lines, mastery, review due dates and sessions.
- Engine: Stockfish 19 lite single-threaded WebAssembly running locally in a Web Worker.

## Decisions

- Buildless HTML/CSS/native JavaScript modules; zero installation/runtime network dependencies.
- chess.js 1.4.0 is vendored with its BSD license; use it for every legality decision.
- Stockfish JS/WASM are vendored with GPLv3 notice; source provenance in vendor documentation.
- Opening names and factual sequences: 3,865 entries from lichess-org/chess-openings (CC0), retrieved 2026-11-06.
- Original instructional text, with literature bibliography. Do not imply access to entire books or paid ChessReps courses.
- Visually match the observed tan Staunty board, dark shell, coach bubble, purple mode controls, selectors, hints, depth modal and settings. Preserve useful desktop/mobile layouts.
- Engine failures must be visible; never display fake evaluations or random moves as engine output.

## Testing interfaces (confirmed through user scope selection)

Training/session interface, PGN import interface, local progress interface, local engine interface, and browser flows. Test external behavior with real chess.js and real Stockfish where supported. User requested Matt Pocock's to-spec → to-tickets → implement/TDD → review loop and a separate commit per completed task.
