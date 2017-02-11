/**
 * Created by Henrikh Kantuni and Shahen Kosyan on 2/10/17.
 */


'use strict';

/**
 * Generate a random number between min and max, inclusive.
 * @param min: {Number} minimum value
 * @param max: {Number} maximum value
 * @return {Number} a random number from [min, max]
 */
Math._random = (min, max) => Math.floor(Math.random() * max) + min;

/**
 * Pad a number with leading 0s up to the given size
 * @param size: {Number} size of the string
 * @return {String} number with leading 0s
 */
// BTDT: don't use arrow functions
Number.prototype.zfill = function (size) {
  let s = String(this);
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
};