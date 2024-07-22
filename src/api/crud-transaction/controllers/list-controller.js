import { mongoCollections } from '~/src/helpers/constants'
import { readAllDocuments } from '~/src/helpers/database-transaction'

/**
 * Controller for handling requests to list all documents from a specified MongoDB collection.
 *
 * This controller retrieves all documents from the specified MongoDB collection and returns them in the response. If an error occurs during the retrieval process, it returns an error message.
 *
 * @type {Object}
 * @property {Function} handler - The function that handles incoming requests to list all documents.
 *
 * @param {Object} request - The request object, which contains the parameters and additional metadata.
 * @param {Object} h - The response toolkit used to build and return the HTTP response.
 *
 * @returns {Object} - The response object, which includes:
 *   - `message` (string): A status message indicating the success of the document retrieval.
 *   - `documents` (Array): An array of documents retrieved from the specified collection.
 *   - `error` (string): An error message if the retrieval fails.
 *
 * @throws {Error} - Returns an error response with a status code of 500 if an exception occurs during document retrieval.
 *
 * @example
 * // Example request parameters
 * {
 *   "collection": "users"
 * }
 *
 * // Example successful response
 * {
 *   "message": "success",
 *   "documents": [
 *     { "_id": "60c72b2f5b4f1a001c8b4567", "name": "John Doe", "email": "john.doe@example.com" },
 *     { "_id": "60c72b2f5b4f1a001c8b4568", "name": "Jane Doe", "email": "jane.doe@example.com" }
 *   ]
 * }
 *
 * // Example error response
 * {
 *   "error": "Failed to retrieve documents"
 * }
 */
const listController = {
  handler: async (request, h) => {
    const { collection } = request.params
    try {
      const documents = await readAllDocuments(
        request.db,
        mongoCollections[collection]
      )

      return h.response({ message: 'success', documents }).code(200)
    } catch (error) {
      return h.response({ error: error.message }).code(500)
    }
  }
}

export default listController
