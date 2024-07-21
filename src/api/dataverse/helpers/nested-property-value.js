/**
 * Retrieves the value of a nested property from a data object using a dot-separated path.
 * @param {Object} data - The data object from which to retrieve the property value.
 * @param {string} path - A dot-separated string representing the path to the nested property.
 * @returns {Promise<*>} - A promise that resolves to the value of the nested property, or `undefined` if the property does not exist.
 *
 * @example
 * const data = { a: { b: { c: 42 } } };
 * const value = await nestedPropertyValue(data, 'a.b.c'); // value will be 42
 *
 * @example
 * const data = { a: { b: { c: 42 } } };
 * const value = await nestedPropertyValue(data, 'a.b.d'); // value will be undefined
 */
const nestedPropertyValue = async (data, path) => {
  return path.split('.').reduce((o, p) => (o ? o?.[p] : undefined), data)
}

export { nestedPropertyValue }
