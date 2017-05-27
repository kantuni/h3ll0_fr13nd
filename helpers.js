/**
 * Created by Henrikh Kantuni and Shahen Kosyan on 2/10/17.
 */


'use strict';

/**
 * Generate a random number between the given minimum and maximum, inclusive.
 * @param min: the minimum value
 * @param max: the maximum value
 * @return a random number from [min, max]
 */

Math._random = (min, max) => Math.floor(Math.random() * max) + min;

/**
 * Pad a number with leading 0s up to the given size
 * @param size: size of the string
 * @return the number with leading 0s
 */

// BTDT: don't use an arrow function here
Number.prototype.zfill = function (size) {
  let s = String(this);
  while (s.length < size) {
    s = '0' + s;
  }
  
  return s;
};
