// Tests for app/js/logic/random.js. Owner: Claude (step 1).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffle, pick, seededRandom } from '../app/js/logic/random.js';

test('shuffle keeps every item and leaves the original unchanged', () => {
  const original = [1, 2, 3, 4, 5, 6];
  const result = shuffle(original, seededRandom(1));
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(original, [1, 2, 3, 4, 5, 6]);
});

test('shuffle gives the same order for the same seed', () => {
  assert.deepEqual(shuffle([1, 2, 3, 4], seededRandom(7)), shuffle([1, 2, 3, 4], seededRandom(7)));
});

test('shuffle is fair: each item lands in each position about equally often', () => {
  const random = seededRandom(42);
  const trials = 24000;
  const counts = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
  for (let t = 0; t < trials; t++) {
    shuffle(['a', 'b', 'c', 'd'], random).forEach((item, position) => {
      counts['abcd'.indexOf(item)][position] += 1;
    });
  }
  // Expected 6000 each; allow 5% either way.
  for (const row of counts) for (const n of row) assert.ok(n > 5700 && n < 6300, `count ${n} is outside the fair range`);
});

test('pick returns the requested number of distinct items', () => {
  const result = pick([1, 2, 3, 4, 5], 3, seededRandom(3));
  assert.equal(result.length, 3);
  assert.equal(new Set(result).size, 3);
});

test('pick refuses to return more items than exist', () => {
  assert.throws(() => pick([1, 2], 3, seededRandom(1)), RangeError);
});

test('seededRandom returns numbers from 0 up to 1', () => {
  const random = seededRandom(9);
  for (let i = 0; i < 1000; i++) {
    const n = random();
    assert.ok(n >= 0 && n < 1);
  }
});
