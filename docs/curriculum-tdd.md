# Curriculum TDD record — ticket #1

Public interface under test: `buildCourses(openings)`. The user confirmed the session/import/progress/engine/browser testing scope through the development-scope selection; catalog correctness supports the session interface with real legal course lines. No private helpers or mocks are tested.

## Red → green slices

1. **Start a coached Italian repertoire without external data.** Added the test before the curriculum module existed. Red: `ERR_MODULE_NOT_FOUND` for `src/courses.mjs`. Implemented the Italian guided line, original plan and coach notes. Green: 1/1 tests.
2. **Train a named factual branch exactly once.** Added a known Fried Liver branch twice to the source input. Red: expected one branch but received zero (`0 !== 1`). Added source matching, SAN tokenization, deduplication and stable line IDs. Green: 2/2 tests.
3. **Access a broad legal two-color repertoire.** Added the catalog-coverage and complete-branch replay test. Red: `at least twenty opening repertoires`. Added the remaining 23 opening course definitions and their original guided notes/plans. Replayed every generated SAN sequence through real chess.js. Green: 3/3 tests, ~1.2 seconds.
4. **Practice five strategy themes from actual positions.** Added the strategy behavior test. Red: expected five strategy courses, received zero (`0 !== 5`). Added original examples with legal FEN starts and concrete move notes. Green: 4/4 tests, ~1.3 seconds, all line replays legal.

## Verification

Command: `node tests/courses.test.mjs` from the project directory. This runs Node's built-in test declarations directly and reports all individual results. `node --test tests/courses.test.mjs` also works in the unrestricted host; the shell sandbox sometimes suppresses worker-level test output, so direct invocation was used for readable red/green evidence.

Final catalog: 29 courses (24 openings and 5 strategy), 2,039 course lines. Exact duplicates within a course are removed; overlapping themed courses intentionally share some factual sequences. All 2,039 generated lines passed legal replay. The expected opening prefixes, five lesson identities, genuine non-starting FENs, original plan content and named Fried Liver branch are asserted against known examples, not recomputed expected outputs.
