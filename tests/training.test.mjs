import test from 'node:test';
import assert from 'node:assert/strict';
import { TrainingSession, describeMove } from '../src/training.mjs';

const course = (moves = ['e4', 'e5', 'Nf3', 'Nc6'], side = 'w', extra = {}) => ({
  id: 'italian', title: 'Italian Game', side, intro: 'Develop and contest the centre.', plans: [],
  lines: [{ id: 'main', title: 'Main line', moves, ...extra }],
});

test('a learner can play the expected move and see the next legal opponent reply', () => {
  const session = new TrainingSession(course());
  assert.equal(session.snapshot().expected.san, 'e4');
  const next = session.play('e2', 'e4');
  assert.equal(next.ply, 1);
  assert.equal(next.turn, 'b');
  assert.equal(next.expected.san, 'e5');
  assert.match(next.fen, /^rnbqkbnr\/pppppppp\/8\/8\/4P3\/8\/PPPP1PPP\/RNBQKBNR b/);
});

test('a legal move outside the selected line is rejected without changing the position', () => {
  const session = new TrainingSession(course());
  const before = session.snapshot().fen;
  const rejected = session.play('d2', 'd4');
  assert.equal(rejected.fen, before);
  assert.equal(rejected.ply, 0);
  assert.equal(rejected.mistakes, 1);
  assert.match(rejected.feedback, /try again|line/i);
});

test('an illegal move returns useful feedback without throwing or changing position', () => {
  const session = new TrainingSession(course());
  const before = session.snapshot().fen;
  const rejected = session.play('e2', 'e5');
  assert.equal(rejected.fen, before);
  assert.equal(rejected.mistakes, 1);
  assert.match(rejected.feedback, /legal|cannot/i);
});

test('automatic opponent advancement plays exactly one reply and stops at the learner turn', () => {
  const session = new TrainingSession(course());
  session.play('e2', 'e4');
  const reply = session.advanceOpponent();
  assert.equal(reply.ply, 2);
  assert.equal(reply.turn, 'w');
  assert.equal(reply.expected.san, 'Nf3');
  assert.equal(reply.history.at(-1).san, 'e5');
  assert.equal(session.advanceOpponent().ply, 2);
});

test('learner input cannot play the opponent move while an automatic reply is pending', () => {
  const session = new TrainingSession(course());
  session.play('e2', 'e4');
  const before = session.snapshot().fen;
  const unchanged = session.play('e7', 'e5');
  assert.equal(unchanged.fen, before);
  assert.equal(unchanged.mistakes, 0);
  assert.match(unchanged.feedback, /opponent|wait/i);
});

test('a line completes after its final reply and further input cannot alter completion', () => {
  const session = new TrainingSession(course(['e4', 'e5']));
  session.play('e2', 'e4');
  const complete = session.advanceOpponent();
  assert.equal(complete.status, 'complete');
  assert.equal(complete.expected, null);
  assert.equal(complete.ply, 2);
  const unchanged = session.play('d2', 'd4');
  assert.equal(unchanged.fen, complete.fen);
  assert.equal(unchanged.mistakes, 0);
});

test('hints reveal the source and then destination without moving, and reset on a correct move', () => {
  const session = new TrainingSession(course());
  const before = session.snapshot().fen;
  assert.equal(session.hint().hintLevel, 1);
  const second = session.hint();
  assert.equal(second.hintLevel, 2);
  assert.equal(second.hints, 2);
  assert.equal(second.fen, before);
  assert.equal(session.hint().hintLevel, 2);
  assert.equal(session.play('e2', 'e4').hintLevel, 0);
});

test('solve plays the learner move with a recorded hint and leaves opponent replies to the UI', () => {
  const session = new TrainingSession(course());
  const solved = session.solve();
  assert.equal(solved.ply, 1);
  assert.equal(solved.hints, 1);
  assert.equal(solved.history.at(-1).san, 'e4');
  const unchanged = session.solve();
  assert.equal(unchanged.fen, solved.fen);
  assert.equal(unchanged.hints, 1);
});

test('a puzzle can begin at a selected ply and a black repertoire waits for the first opponent move', () => {
  const puzzle = new TrainingSession(course(), { startPly: 2, mode: 'Puzzles' });
  assert.equal(puzzle.snapshot().ply, 2);
  assert.equal(puzzle.snapshot().expected.san, 'Nf3');
  assert.deepEqual(puzzle.snapshot().history.map(move => move.san), ['e4', 'e5']);
  const black = new TrainingSession(course(['e4', 'e5'], 'b'));
  assert.equal(black.snapshot().side, 'b');
  assert.equal(black.advanceOpponent().expected.san, 'e5');
  assert.equal(black.play('e7', 'e5').status, 'complete');
});

test('invalid course data is rejected before a learner starts a broken session', () => {
  assert.throws(() => new TrainingSession(course(['e4', 'e5', 'e4'])), /line|ply|move/i);
  assert.throws(() => new TrainingSession(course(), { lineIndex: 8 }), /line/i);
  assert.throws(() => new TrainingSession(course(), { startPly: -1 }), /ply/i);
  assert.throws(() => new TrainingSession(course(), { startPly: 9 }), /ply/i);
  assert.throws(() => new TrainingSession(course(['e4'], 'x')), /side/i);
});

test('coaching names castling and promotion so the learner can follow special moves', () => {
  assert.equal(describeMove({ piece: 'k', from: 'e1', to: 'g1', san: 'O-O' }), 'Castle kingside (O-O).');
  assert.equal(describeMove({ piece: 'k', from: 'e8', to: 'c8', san: 'O-O-O' }), 'Castle queenside (O-O-O).');
  assert.equal(describeMove({ piece: 'p', to: 'a8', san: 'a8=N', promotion: 'n' }), 'Play pawn to a8 and promote to knight.');
});

test('castling moves the rook, en passant removes the captured pawn, and underpromotion is respected', () => {
  const castle = new TrainingSession(course(['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'O-O']), { startPly: 6 });
  assert.equal(castle.play('e1', 'g1').status, 'complete');
  assert.match(castle.snapshot().fen, /RNBQ1RK1 b/);

  const ep = new TrainingSession(course(['e4', 'a6', 'e5', 'd5', 'exd6']), { startPly: 4 });
  assert.equal(ep.play('e5', 'd6').history.at(-1).flags, 'e');
  assert.match(ep.snapshot().fen, /^rnbqkbnr\/1pp1pppp\/p2P4\/8\/8\/8/);

  const promotion = new TrainingSession(course(['a8=N'], 'w', { fen: '4k3/P7/8/8/8/8/8/4K3 w - - 0 1' }));
  assert.equal(promotion.snapshot().expected.promotion, 'n');
  assert.equal(promotion.play('a7', 'a8').ply, 0);
  const promoted = promotion.play('a7', 'a8', 'n');
  assert.equal(promoted.status, 'complete');
  assert.match(promoted.fen, /^N3k3/);
});

test('mutating a returned snapshot or source course cannot alter the active training line', () => {
  const source = course();
  const session = new TrainingSession(source);
  source.lines[0].moves[0] = 'd4';
  const snapshot = session.snapshot();
  snapshot.line.moves[0] = 'c4';
  snapshot.expected.to = 'd4';
  assert.equal(session.snapshot().expected.san, 'e4');
  session.play('e2', 'e4');
  const moved = session.snapshot();
  moved.history[0].san = 'd4';
  assert.equal(session.snapshot().history[0].san, 'e4');
});

test('a selected training mode is preserved across session snapshots and moves', () => {
  const session = new TrainingSession(course(), { mode: 'Drill' });
  assert.equal(session.snapshot().mode, 'Drill');
  assert.equal(session.play('e2', 'e4').mode, 'Drill');
  assert.equal(new TrainingSession(course()).snapshot().mode, 'Learn');
});
