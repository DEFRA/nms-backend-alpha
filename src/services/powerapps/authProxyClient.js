// Import the handleResponse function to process HTTP responses
import { handleResponse } from '~/src/helpers/fetchProxyWrapper'
// Import the proxyFetch function to handle HTTP requests with proxy support
import { proxyFetch } from '~/src/helpers/proxy-fetch'

// Import the createLogger function to set up logging
const { createLogger } = require('~/src/helpers/logging/logger')

// Create a logger instance for logging information
const logger = createLogger()

/**
 * Sends an asynchronous GET request using proxyFetch and handles the response.
 * @param {string} url - The URL to send the GET request to.
 * @param {Object} options - The options for the fetch request, such as headers.
 * @returns {Object} - The processed response object from handleResponse.
 * @throws {Error} - Throws an error if the GET request fails.
 */
const sendGetRequestAsync = async (url, options) => {
  try {
    const response = await proxyFetch(url, options)
    return await handleResponse(response)
  } catch (error) {
    logger.error(`GET request failed: ${error.message}`)
    throw error
  }
}

/**
 * Sends an asynchronous POST request using proxyFetch and handles the response.
 * @param {string} url - The URL to send the POST request to.
 * @param {Object} options - The options for the fetch request, such as headers and body.
 * @returns {Object} - The processed response object from handleResponse.
 * @throws {Error} - Throws an error if the POST request fails.
 */
const sendPostRequestAsync = async (url, options) => {
  try {
    const response = await proxyFetch(url, {
      ...options,
      method: 'POST'
    })
    return await handleResponse(response)
  } catch (error) {
    logger.error(`POST request failed: ${error.message}`)
    throw error
  }
}

// Export the sendGetRequestAsync and sendPostRequestAsync functions for use in other modules
export { sendGetRequestAsync, sendPostRequestAsync }
