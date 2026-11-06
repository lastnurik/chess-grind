import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Chess } from '../vendor/chess.js';
import { buildCourses } from '../src/courses.mjs';

const openings = JSON.parse(await readFile(new URL('../src/openings.json', import.meta.url), 'utf8'));

test('learner can start a coached Italian repertoire without external data', () => {
  const italian = buildCourses([]).find(course => course.id === 'italian');
  assert.equal(italian.title, 'The Italian Game');
  assert.equal(italian.side, 'w');
  assert.deepEqual(italian.lines[0].moves.slice(0, 5), ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4']);
  assert.ok(italian.plans.some(plan => /d4/.test(plan)));
  assert.ok(italian.lines[0].notes[4].includes('f7'));
});

test('learner can train named branches from the public opening data without duplicates', () => {
  const source = { eco: 'C57', name: 'Italian Game: Two Knights Defense, Fried Liver Attack', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5 6. Nxf7 Kxf7 7. Qf3+ Ke6' };
  const italian = buildCourses([source, source]).find(course => course.id === 'italian');
  const branches = italian.lines.filter(branch => branch.title.includes('Fried Liver'));
  assert.equal(branches.length, 1);
  assert.equal(branches[0].moves.at(-1), 'Ke6');
  assert.ok(branches[0].id);
  assert.ok(branches[0].notes[0]);
});

test('learner has a broad two-color catalog with original plans and legal complete lines', () => {
  const courses = buildCourses(openings);
  const openingCourses = courses.filter(course => course.category === 'opening');
  assert.ok(openingCourses.length >= 20, 'at least twenty opening repertoires');
  for (const id of ['italian', 'ruy-lopez', 'london', 'caro-kann', 'french', 'scandinavian', 'sicilian-najdorf', 'kings-indian', 'queens-gambit', 'counter-london']) {
    assert.ok(courses.some(course => course.id === id), `course available: ${id}`);
  }
  for (const course of courses) {
    assert.ok(course.intro.length > 80, `${course.id} has original teaching`);
    assert.ok(course.plans.length >= 3, `${course.id} has concrete plans`);
    assert.ok(['w', 'b'].includes(course.side));
    const unique = new Set();
    for (const branch of course.lines) {
      const game = new Chess(branch.fen);
      for (const san of branch.moves) {
        assert.doesNotThrow(() => game.move(san), `${course.id}/${branch.title}: ${san}`);
      }
      const key = (branch.fen || '') + branch.moves.join(' ');
      assert.ok(!unique.has(key), `duplicate line: ${course.id}/${branch.title}`);
      unique.add(key);
      assert.ok(branch.notes[0], `${branch.id} explains its opening plan`);
    }
  }
});

test('learner can practice five distinct strategy themes from meaningful middlegame positions', () => {
  const strategy = buildCourses(openings).filter(course => course.category === 'strategy');
  assert.equal(strategy.length, 5);
  for (const theme of ['central-breaks', 'development', 'carlsbad', 'isolani', 'fianchetto']) {
    const course = strategy.find(course => course.id === `strategy-${theme}`);
    assert.ok(course, `theme: ${theme}`);
    assert.ok(course.lines[0].fen, `${theme} begins from an instructional position`);
    assert.ok(course.lines[0].moves.length >= 6);
    const game = new Chess(course.lines[0].fen);
    for (const move of course.lines[0].moves) assert.doesNotThrow(() => game.move(move));
    assert.ok(Object.values(course.lines[0].notes).some(note => note.length > 80));
  }
});
