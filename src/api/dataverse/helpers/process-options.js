import { nestedPropertyValue } from './nested-property-value'

/**
 * Processes an array of options to create a set of option objects with value and label properties.
 * Each option object is derived from nested properties within each element of the `optionsData` array.
 *
 * @param {Array<Object>} optionsData - An array of objects where each object contains nested properties.
 * @param {string} valuePath - A dot-separated string representing the path to the property used for the `value` of the option.
 * @param {string} labelPath - A dot-separated string representing the path to the property used for the `label` of the option.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of option objects, where each object has `value` and `text` properties. If no options are found, a default option is returned.
 *
 * @example
 * const optionsData = [
 *   { data: { id: '1', name: 'Option 1' } },
 *   { data: { id: '2', name: 'Option 2' } }
 * ];
 * const valuePath = 'data.id';
 * const labelPath = 'data.name';
 * const options = await processOptions(optionsData, valuePath, labelPath);
 * // options will be: [{ value: '1', text: 'Option 1' }, { value: '2', text: 'Option 2' }]
 *
 * @example
 * const optionsData = null;
 * const valuePath = 'data.id';
 * const labelPath = 'data.name';
 * const options = await processOptions(optionsData, valuePath, labelPath);
 * // options will be: [{ value: '', label: '--No records found--' }]
 */
const processOptions = async (optionsData, valuePath, labelPath) => {
  if (!optionsData) {
    return [{ value: '', label: '--No records found--' }]
  }
  const optionsSet = []
  optionsData.forEach(async (option) => {
    const key = await nestedPropertyValue(option, valuePath)
    if (key) {
      const optionSet = {
        value: key,
        text: (await nestedPropertyValue(option, labelPath)) ?? 'No Label'
      }
      optionsSet.push(optionSet)
    }
  })
  return optionsSet
}

export { processOptions }
