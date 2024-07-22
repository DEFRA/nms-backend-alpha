/**
 * Builds an error message object based on a given path and value.
 * @param {Array<string>} path - The path array representing the keys of the nested object.
 * @param {Object} value - The value to assign at the end of the path.
 * @returns {Object} - The constructed error message object.
 */
function buildErrorMessages(path, value) {
  const object = {}
  path.reduce((obj, item) => (obj[item] = { ...value }), object)

  return object
}

/**
 * Constructs a comprehensive error details object from an array of error details.
 * @param {Array<Object>} errorDetails - The array of error detail objects, each containing a path and a message.
 * @returns {Object} - The aggregated error details object.
 */
function buildErrorDetails(errorDetails = []) {
  return errorDetails.reduce((errors, detail) => {
    const errorMessages = buildErrorMessages(detail.path, {
      message: detail.message
    })

    return {
      ...errorMessages,
      ...errors
    }
  }, {})
}

// Export the buildErrorDetails function for use in other modules
export { buildErrorDetails }
