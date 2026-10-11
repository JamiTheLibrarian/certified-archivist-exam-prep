// Fair shuffling and drawing. Owner: Claude (step 1).
// Every function takes `random`, a function returning a number from 0 up to 1.
// The app passes Math.random; tests pass a predictable function.

/**
 * Returns a new array in random order (Fisher–Yates), leaving the original unchanged.
 * Every order is equally likely.
 */
export function shuffle(array, random) {
  if (!Array.isArray(array)) throw new TypeError('shuffle() needs an array');
  if (typeof random !== 'function') throw new TypeError('shuffle() needs a random function');
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Returns `count` distinct items chosen at random.
 * Throws if asked for more items than the array holds.
 */
export function pick(array, count, random) {
  if (!Number.isInteger(count) || count < 0) throw new RangeError('pick() needs a whole-number count');
  if (count > array.length) throw new RangeError(`pick() asked for ${count} items but only ${array.length} exist`);
  return shuffle(array, random).slice(0, count);
}

/**
 * A predictable random function for tests: the same seed always gives the same sequence.
 * (Mulberry32.) Not used by the app itself.
 */
export function seededRandom(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
