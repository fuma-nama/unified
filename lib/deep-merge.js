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

  for (const key of Object.keys(values)) {
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
