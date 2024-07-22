import { buildErrorDetails } from '~/src/helpers/build-error-details'
import { mongoCollections, schemaMapping } from '~/src/helpers/constants'
import { createDocument } from '~/src/helpers/database-transaction'

/**
 * Controller for handling the creation of documents in the database.
 *
 * This controller is responsible for validating and creating documents in the specified MongoDB collection. It retrieves the validation schema based on the provided entity, validates the payload, and if valid, creates a document in the specified collection. In case of validation or database errors, appropriate responses are returned.
 *
 * @type {Object}
 * @property {Function} handler - The function that handles incoming requests to create a document.
 *
 * @param {Object} request - The request object, which contains the payload and additional metadata.
 * @param {Object} h - The response toolkit used to build and return the HTTP response.
 *
 * @returns {Object} - The response object, which includes:
 *   - `message` (string): A status message indicating the success or failure of the document creation.
 *   - `document` (Object): The created document if the creation was successful.
 *   - `error` (Object): Error details if validation or creation fails. Includes a detailed error message and validation errors if applicable.
 *
 * @throws {Error} - Returns an error response with a status code of 500 if an exception occurs during document creation.
 *
 * @example
 * // Example payload
 * {
 *   "entity": "user",
 *   "name": "John Doe",
 *   "email": "john.doe@example.com"
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
 * // Example error response
 * {
 *   "error": {
 *     "message": "Validation failed",
 *     "details": [
 *       {
 *         "message": "\"email\" must be a valid email",
 *         "path": ["email"],
 *         "type": "string.email",
 *         "context": {}
 *       }
 *     ]
 *   }
 * }
 */
const createController = {
  handler: async (request, h) => {
    const { entity, ...payload } = request.payload
    try {
      const validationResult = schemaMapping[entity].validate(request.payload, {
        abortEarly: false
      })
      if (validationResult?.error) {
        const errorDetails = buildErrorDetails(validationResult?.error?.details)
        request.logger.info(
          `Create document validation error: ${JSON.stringify(errorDetails)}`
        )
        return h.response({ error: errorDetails }).code(400)
      }
      const collection = mongoCollections[request.params?.collection]
      const document = await createDocument(request.db, collection, payload)
      return h.response({ message: 'success', document }).code(201)
    } catch (error) {
      request.logger.info(`Create document error: ${error}`)
      return h.response({ error: error.message }).code(500)
    }
  }
}

export default createController
