import { buildErrorDetails } from '~/src/helpers/build-error-details'
import { mongoCollections, schemaMapping } from '~/src/helpers/constants'
import { updateDocument } from '~/src/helpers/database-transaction'

/**
 * Controller for handling requests to update a specific document in a MongoDB collection.
 *
 * This controller updates an existing document in a specified MongoDB collection based on its ID. The document's data is validated against a predefined schema. If validation fails, an error response with detailed validation errors is returned. If validation succeeds, the document is updated and a success response is returned. Any exceptions during the update process are caught and an error message is returned.
 *
 * @type {Object}
 * @property {Function} handler - The function that processes incoming requests to update a document by its ID.
 *
 * @param {Object} request - The request object, which includes:
 *   - {string} params.id - The ID of the document to update, formatted as a MongoDB ObjectId.
 *   - {string} params.collection - The name of the MongoDB collection where the document is stored.
 *   - {Object} payload - The data to update the document with, including an `entity` field to determine the schema for validation.
 *
 * @param {Object} h - The response toolkit used to build and return the HTTP response.
 *
 * @returns {Object} - The response object, which includes:
 *   - `message` (string): A status message indicating the success of the document update.
 *   - `document` (Object): The updated document.
 *   - `error` (string): An error message if validation fails or if an exception occurs.
 *
 * @throws {Error} - Returns an error response with a status code of 500 if an exception occurs during document update.
 *
 * @example
 * // Example request parameters
 * {
 *   "params": {
 *     "id": "60c72b2f5b4f1a001c8b4567",
 *     "collection": "users"
 *   },
 *   "payload": {
 *     "entity": "user",
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "email": "john.doe@example.com"
 *   }
 * }
 *
 * // Example successful response
 * {
 *   "message": "success",
 *   "document": {
 *     "_id": "60c72b2f5b4f1a001c8b4567",
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "email": "john.doe@example.com"
 *   }
 * }
 *
 * // Example validation error response
 * {
 *   "error": [
 *     {
 *       "message": "firstName is required",
 *       "path": ["firstName"],
 *       "type": "any.required"
 *     }
 *   ]
 * }
 *
 * // Example error response
 * {
 *   "error": "Failed to update document"
 * }
 */
const updateController = {
  handler: async (request, h) => {
    const { entity, ...payload } = request.payload
    const { id, collection } = request.params
    try {
      const validationResult = schemaMapping[entity].validate(request.payload, {
        abortEarly: false
      })
      if (validationResult?.error) {
        const errorDetails = buildErrorDetails(validationResult?.error?.details)
        request.logger.info(
          `Update document validation error: ${JSON.stringify(errorDetails)}`
        )
        return h.response({ error: errorDetails }).code(400)
      }
      const document = await updateDocument(
        request.db,
        mongoCollections[collection],
        id,
        payload
      )
      return h.response({ message: 'success', document }).code(201)
    } catch (error) {
      request.logger.info(`Create document error: ${error}`)
      return h.response({ error: error.message }).code(500)
    }
  }
}

export default updateController
