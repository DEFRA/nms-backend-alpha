import { ObjectId } from 'mongodb'
import { mongoCollections } from '~/src/helpers/constants'
import { readDocument } from '~/src/helpers/database-transaction'

/**
 * Controller for handling requests to retrieve a specific document from a MongoDB collection by its ID.
 *
 * This controller fetches a single document from a specified MongoDB collection using its ID. If the document is found, it returns the document in the response. If not, it returns a 404 error indicating that the document was not found. Any exceptions during the retrieval process are caught and an error message is returned with a 500 status code.
 *
 * @type {Object}
 * @property {Function} handler - The function that processes incoming requests to retrieve a document by its ID.
 *
 * @param {Object} request - The request object, which includes:
 *   - {string} params.id - The ID of the document to retrieve, formatted as a MongoDB ObjectId.
 *   - {string} params.collection - The name of the MongoDB collection from which to retrieve the document.
 * @param {Object} h - The response toolkit used to build and return the HTTP response.
 *
 * @returns {Object} - The response object, which includes:
 *   - `message` (string): A status message indicating the success of the document retrieval.
 *   - `document` (Object): The document retrieved from the specified collection.
 *   - `error` (string): An error message if the document is not found or if an exception occurs.
 *
 * @throws {Error} - Returns an error response with a status code of 500 if an exception occurs during document retrieval.
 *
 * @example
 * // Example request parameters
 * {
 *   "params": {
 *     "id": "60c72b2f5b4f1a001c8b4567",
 *     "collection": "users"
 *   }
 * }
 *
 * // Example successful response
 * {
 *   "message": "success",
 *   "document": {
 *     "_id": "60c72b2f5b4f1a001c8b4567",
 *     "name": "John Doe",
 *     "email": "john.doe@example.com"
 *   }
 * }
 *
 * // Example not found response
 * {
 *   "error": "Document not found"
 * }
 *
 * // Example error response
 * {
 *   "error": "Failed to retrieve document"
 * }
 */
const readController = {
  handler: async (request, h) => {
    const { id, collection } = request.params
    try {
      const document = await readDocument(
        request.db,
        mongoCollections[collection],
        {
          _id: new ObjectId(id)
        }
      )

      if (document) {
        return h.response({ message: 'success', document }).code(200)
      } else {
        return h.response({ error: 'Document not found' }).code(404)
      }
    } catch (error) {
      return h.response({ error: error.message }).code(500)
    }
  }
}

export default readController
