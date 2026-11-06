# Chess Grind curriculum sources

## Opening facts

The bundled `src/openings.json` contains **3,865 entries** from the Lichess opening-name dataset, retrieved on **2026-11-06**:

- Repository and data: https://github.com/lichess-org/chess-openings
- License and field definitions: https://github.com/lichess-org/chess-openings/blob/master/README.md
- Source files: `a.tsv`, `b.tsv`, `c.tsv`, `d.tsv`, `e.tsv` on the repository's `master` branch.

The dataset supplies opening names, ECO codes and factual move sequences. Its maintainers dedicate the work to the public domain under CC0. It is an opening taxonomy, **not** an engine-ranked recommendation list or a collection of fully annotated lessons. A named gambit or sideline appearing in it does not imply that the move is objectively best.

`buildCourses()` organizes these entries into 24 opening courses and adds one guided practical sequence at the beginning of each. Exact duplicate move sequences within each course are removed. The current result is **2,034 opening course lines**, plus **5 original strategy examples**, for **2,039 course lines** across **29 courses**. Some lines intentionally appear in more than one course, such as the Italian/Fried Liver and white/black London courses; 2,039 is not a count of globally distinct openings. Counts come from the actual generated catalog, not the reference website's course counts.

Every delivered line was replayed through chess.js in a behavior test to verify legal SAN, including all five strategy FEN starts. Legal verification does not certify that all moves are optimal. The local engine is available for evaluating alternatives.

## Original instruction and literature

The introductions, descriptions, plans and coach notes in this project are original instructional text. They do not reproduce paid ChessReps annotations, book chapters, or grandmaster course content. No grandmaster is represented as the author or endorser of these lessons.

The curriculum distinguishes common opening concepts from source-specific analysis. The following established books are useful further study and explain the concepts covered by the strategy themes:

- **Paul van der Sterren, _Fundamental Chess Openings_ (Gambit).** General opening orientation and the purpose of standard structures. Official sample URL: https://www.gambitbooks.com/pdfs/FCO_Fundamental_Chess_Openings.pdf. The sample could not be retrieved during this session, so this is a bibliographic recommendation rather than a claim that the full text or that sample was consulted.
- **Johan Hellsten, _Mastering Opening Strategy_ (Everyman).** Development, central play, pawn breaks, attack and defense. Official book information consulted: https://www.newinchess.com/mastering-opening-strategy. Only publisher information was available here; this project does not claim to reproduce or summarize the full book.
- **Mauricio Flores Rios, _Chess Structures: A Grandmaster Guide_ (Quality Chess).** A structure-based route to middlegame plans. Publisher excerpt consulted: https://www.qualitychess.co.uk/ebooks/Flores_Rios_Chess_Structures-excerpt.pdf. The accessible excerpt's contents identify themes such as the isolani, Carlsbad, Caro-Kann, Sicilian and King's Indian formations. The app's examples and prose are independently written.

The five strategy examples cover central breaks, development and initiative, the Carlsbad minority attack, the isolated queen's pawn, and the relationship between a fianchetto and central pawn chains. The development example uses the public historical move facts of Morphy's 1858 Opera Game. Other example continuations illustrate coherent plans; they are not presented as forced best play.

## Chess rules and engine

- **chess.js 1.4.0**, Jeff Hlywa and contributors: https://github.com/jhlywa/chess.js. Vendored BSD-2-Clause license at `vendor/CHESS-LICENSE`.
- **Stockfish.js 19 lite single-threaded**, Nathan Rugg / Chess.com and Stockfish contributors: https://github.com/nmrugg/stockfish.js. Vendored GPLv3 text and upstream README are retained. The engine files were already available locally from their upstream distribution. No online engine endpoint is required.

## Interface reference

https://www.chessreps.com/ was inspected directly: catalog, Italian Game trainer, depth selection, automatic opponent reply, hints, line selection, mode selection and preferences. Reference font and Staunty piece artwork were obtained from assets visible in the rendered interface, for the private use authorized by the user. This project is called Chess Grind and remains local-only. Paid or account-gated reference behavior was not inspected, so exact parity there is unverified.
