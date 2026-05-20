/*
The MIT License (MIT)

Copyright (c) 2014 Stefan Thomas

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import isPlainObj from 'is-plain-obj'

const own = {}.hasOwnProperty

/**
 * Deeply merge plain objects and arrays.
 *
 * @template {Record<string, unknown> | Array<unknown>} Target
 * @param {Target} target
 * @param {unknown} source
 * @returns {Target}
 */
export function deepMerge(target, source) {
  if (!source || typeof source !== 'object') {
    return target
  }

  const values = /** @type {Record<string, unknown>} */ (source)

  for (const key in values) {
    // mainly to satisfy eslint, `getOwn()` also does the check
    if (!Object.hasOwn(source, key)) continue
    const value = getOwn(values, key)

    if (value === undefined || value === target) {
      continue
    }

    if (Array.isArray(value)) {
      const existing = getOwn(target, key)
      const base = Array.isArray(existing)
        ? /** @type {Array<unknown>} */ (existing)
        : []

      setOwn(target, key, deepMerge(base, value))
    } else if (isPlainObj(value)) {
      const existing = getOwn(target, key)
      const base = isPlainObj(existing) ? existing : {}

      setOwn(target, key, deepMerge(base, value))
    } else {
      setOwn(target, key, value)
    }
  }

  return target
}

/**
 * @param {Record<string, unknown> | Array<unknown>} target
 * @param {string} key
 * @returns {unknown}
 */
function getOwn(target, key) {
  if (key === '__proto__' && !own.call(target, key)) {
    return undefined
  }

  return /** @type {Record<string, unknown>} */ (target)[key]
}

/**
 * @param {Record<string, unknown> | Array<unknown>} target
 * @param {string} key
 * @param {unknown} value
 * @returns {undefined}
 */
function setOwn(target, key, value) {
  if (key === '__proto__') {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      value,
      writable: true
    })
  } else {
    const record = /** @type {Record<string, unknown>} */ (target)
    record[key] = value
  }
}
