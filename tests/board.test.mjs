import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from '../vendor/chess.js';
import { bindBoard } from '../src/board.mjs';

// The browser's event/layout APIs are the boundary; chess moves use the real engine.
function boardHarness() {
  const game = new Chess();
  const container = new EventTarget();
  const selected = [], moves = [];
  const piece = { style: {} };
  const classes = new Set();
  const source = {
    dataset: { square: 'e2' },
    closest: () => source,
    querySelector: () => piece,
    classList: { add: value => classes.add(value), remove: value => classes.delete(value) },
  };
  const destination = { dataset: { square: 'e4' }, closest() { return this; } };
  let hit = destination, captured = false;
  container.contains = value => value === source || value === destination;
  container.ownerDocument = { elementFromPoint: () => hit };
  container.setPointerCapture = () => { captured = true; };
  container.hasPointerCapture = () => captured;
  container.releasePointerCapture = () => { captured = false; };
  bindBoard(container, {
    getGame: () => game,
    onSelect: square => selected.push(square),
    onMove: (from, to) => { moves.push([from, to]); try { game.move({ from, to }); } catch {} },
  });
  function send(type, overrides = {}) {
    const event = new Event(type, { cancelable: true });
    for (const [key, value] of Object.entries({ target: source, pointerId: 1, button: 0, isPrimary: true, clientX: 225, clientY: 325, detail: 1, ...overrides })) {
      Object.defineProperty(event, key, { value });
    }
    container.dispatchEvent(event);
    return event;
  }
  return { game, piece, selected, moves, send, setHit: value => { hit = value; }, setDestination: square => { destination.dataset.square = square; } };
}

test('dragging moves the piece under the pointer and drops one legal move without a follow-up click', () => {
  const board = boardHarness();
  board.send('pointerdown');
  board.send('pointermove', { clientX: 225, clientY: 225 });
  assert.match(board.piece.style.transform ?? '', /-100px/);
  board.send('pointerup', { clientX: 225, clientY: 225 });
  assert.deepEqual(board.moves, [['e2', 'e4']]);
  assert.equal(board.game.get('e4').type, 'p');
  assert.equal(board.piece.style.transform, '');
  board.send('click');
  assert.deepEqual(board.selected, []);
});

test('a tap still selects a square when pointer capture retargets the click to the board', () => {
  const board = boardHarness();
  board.send('pointerdown');
  board.send('pointerup');
  board.send('click', { target: { closest: () => null } });
  assert.deepEqual(board.selected, ['e2']);
  assert.deepEqual(board.moves, []);
});

for (const ending of ['pointercancel', 'lostpointercapture', 'outside']) {
  test(`${ending} restores the piece without playing a move`, () => {
    const board = boardHarness();
    board.send('pointerdown');
    board.send('pointermove', { clientY: 225 });
    if (ending === 'outside') {
      board.setHit(null);
      board.send('pointerup', { clientY: 225 });
    } else board.send(ending);
    assert.equal(board.piece.style.transform, '');
    assert.deepEqual(board.moves, []);
    assert.equal(board.game.get('e2').type, 'p');
  });
}

test('a changed position cancels a pending drag and ignores another pointer', () => {
  const board = boardHarness();
  board.send('pointerdown');
  board.send('pointermove', { pointerId: 2, clientY: 225 });
  assert.equal(board.piece.style.transform, undefined);
  board.send('pointermove', { clientY: 225 });
  board.game.move('d4');
  board.send('pointerup', { clientY: 225 });
  assert.equal(board.piece.style.transform, '');
  assert.deepEqual(board.moves, []);
});

test('native image dragging is blocked and keyboard square activation still works', () => {
  const board = boardHarness();
  assert.equal(board.send('dragstart').defaultPrevented, true);
  board.send('click', { detail: 0 });
  assert.deepEqual(board.selected, ['e2']);
});

test('an illegal drop restores the piece and leaves move validation to the chess session', () => {
  const board = boardHarness();
  board.setDestination('e5');
  board.send('pointerdown');
  board.send('pointermove', { clientY: 175 });
  board.send('pointerup', { clientY: 175 });
  assert.deepEqual(board.moves, [['e2', 'e5']]);
  assert.equal(board.game.get('e2').type, 'p');
  assert.equal(board.game.get('e5'), undefined);
  assert.equal(board.piece.style.transform, '');
});


test('a touch pointer can drag a piece without starting native scrolling', () => {
  const board = boardHarness();
  board.send('pointerdown', { pointerType: 'touch' });
  const moved = board.send('pointermove', { pointerType: 'touch', clientY: 225 });
  assert.equal(moved.defaultPrevented, true);
  board.send('pointerup', { pointerType: 'touch', clientY: 225 });
  assert.deepEqual(board.moves, [['e2', 'e4']]);
});
