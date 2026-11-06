import { Chess } from '../vendor/chess.js';

export function describeMove(move) {
  if (!move) return 'Line complete.';
  const names = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
  if (move.san?.startsWith('O-O-O')) return 'Castle queenside (O-O-O).';
  if (move.san?.startsWith('O-O')) return 'Castle kingside (O-O).';
  if (move.promotion) return `Play pawn to ${move.to} and promote to ${names[move.promotion]}.`;
  return `Play ${names[move.piece]} to ${move.to}.`;
}

/** A coached line. Opponent replies are explicit so the UI can animate them. */
export class TrainingSession {
  #game;
  #line;
  #side;
  #mode;
  #lineIndex;
  #ply = 0;
  #mistakes = 0;
  #hints = 0;
  #hintLevel = 0;
  #feedback = '';

  constructor(course, { lineIndex = 0, mode = 'Learn', startPly = 0 } = {}) {
    if (!course || !['w', 'b'].includes(course.side)) throw new Error('Course side must be w or b.');
    if (!Number.isInteger(lineIndex) || lineIndex < 0 || !course.lines?.[lineIndex]) throw new Error('Choose an existing course line.');
    this.#line = structuredClone(course.lines[lineIndex]);
    if (!Array.isArray(this.#line.moves) || this.#line.moves.some(move => typeof move !== 'string')) throw new Error('Line moves must be SAN strings.');
    if (!Number.isInteger(startPly) || startPly < 0 || startPly > this.#line.moves.length) throw new Error('Starting ply must be within the selected line.');
    const validation = new Chess(this.#line.fen);
    this.#line.moves = this.#line.moves.map((move, ply) => {
      try { return validation.move(move).san; }
      catch { throw new Error(`Invalid move in line at ply ${ply + 1}: ${move}`); }
    });
    this.#side = course.side;
    this.#mode = mode;
    this.#lineIndex = lineIndex;
    this.#game = new Chess(this.#line.fen);
    for (let ply = 0; ply < startPly; ply += 1) this.#game.move(this.#line.moves[ply]);
    this.#ply = startPly;
  }

  snapshot() {
    const probe = new Chess(this.#game.fen());
    const move = this.#line.moves[this.#ply] ? probe.move(this.#line.moves[this.#ply]) : null;
    return {
      mode: this.#mode, fen: this.#game.fen(), turn: this.#game.turn(), side: this.#side, ply: this.#ply,
      history: this.#game.history({ verbose: true }), line: structuredClone(this.#line),
      lineIndex: this.#lineIndex, expected: move ? { from: move.from, to: move.to, san: move.san, piece: move.piece, promotion: move.promotion } : null,
      status: move ? 'playing' : 'complete', mistakes: this.#mistakes, hints: this.#hints,
      hintLevel: this.#hintLevel, feedback: this.#feedback,
    };
  }

  hint() {
    if (this.#ply < this.#line.moves.length && this.#game.turn() === this.#side) {
      this.#hints += 1;
      this.#hintLevel = Math.min(2, this.#hintLevel + 1);
    }
    return this.snapshot();
  }

  solve() {
    const next = this.snapshot();
    if (next.status === 'playing' && next.turn === this.#side) {
      this.#hints += 1;
      return this.play(next.expected.from, next.expected.to, next.expected.promotion || 'q');
    }
    return next;
  }

  advanceOpponent() {
    const next = this.snapshot();
    if (next.status === 'playing' && next.turn !== this.#side) {
      this.#game.move(next.expected.san);
      this.#ply += 1;
      this.#hintLevel = 0;
      this.#feedback = '';
    }
    return this.snapshot();
  }

  play(from, to, promotion = 'q') {
    if (this.#ply >= this.#line.moves.length) return this.snapshot();
    if (this.#game.turn() !== this.#side) {
      this.#feedback = 'Wait for the opponent reply.';
      return this.snapshot();
    }
    const expected = this.snapshot().expected;
    const probe = new Chess(this.#game.fen());
    let move;
    try {
      move = probe.move({ from, to, promotion });
    } catch {
      this.#mistakes += 1;
      this.#feedback = 'That move is not legal in this position. Try again.';
      return this.snapshot();
    }
    if (move.san !== expected?.san) {
      this.#mistakes += 1;
      this.#feedback = 'That move is legal, but this line uses a different move. Try again.';
      return this.snapshot();
    }
    this.#game.move({ from, to, promotion });
    this.#ply += 1;
    this.#hintLevel = 0;
    this.#feedback = 'Correct!';
    return this.snapshot();
  }
}
