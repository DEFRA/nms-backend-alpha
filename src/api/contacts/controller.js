// Import constants for MongoDB collections
import { mongoCollections } from '~/src/helpers/constants'
// Import database transaction helper functions
import {
  createDocument,
  readAllDocuments,
  readDocument
} from '~/src/helpers/database-transaction'
// Import the contact schema for validation
import contactSchema from '~/src/schema/contact'

// Extract the contact collection name from mongoCollections
const { contact } = mongoCollections

/**
 * Handler to retrieve all documents from the contact collection.
 * @param {Object} request - The Hapi request object containing the database instance.
 * @param {Object} h - The Hapi response toolkit for building the response.
 * @returns {Object} - The response object containing the status message and the list of entities.
 * @throws {Error} - Returns a 500 status code with the error message if the operation fails.
 */
const findAllDocuments = {
  handler: async (request, h) => {
    try {
      const entities = await readAllDocuments(request.db, contact)

      return h.response({ message: 'success', entities }).code(200)
    } catch (error) {
      return h.response({ error: error.message }).code(500)
    }
  }
}

/**
 * Handler to retrieve a single document from the contact collection by its ID.
 * @param {Object} request - The Hapi request object containing the ID parameter and the database instance.
 * @param {Object} h - The Hapi response toolkit for building the response.
 * @returns {Object} - The response object containing the status message and the retrieved entity, or an error message if not found.
 * @throws {Error} - Returns a 500 status code with the error message if the operation fails.
 */
const findDocument = {
  handler: async (request, h) => {
    const { id } = request.params
    try {
      const entity = await readDocument(request.db, contact, {
        _id: id
      })

      if (entity) {
        return h.response({ message: 'success', entity }).code(200)
      } else {
        return h.response({ error: 'Entity not found' }).code(404)
      }
    } catch (error) {
      return h.response({ error: error.message }).code(500)
    }
  }
}

/**
 * Handler to save a new document to the contact collection.
 * Validates the request payload using the contact schema before creating the document.
 * @param {Object} request - The Hapi request object containing the payload and the database instance.
 * @param {Object} h - The Hapi response toolkit for building the response.
 * @returns {Object} - The response object containing the status message and the created entity, or an error message if validation fails.
 * @throws {Error} - Returns a 500 status code with the error message if the operation fails.
 */
const saveDocument = {
  handler: async (request, h) => {
    // Validate the request payload using the contact schema
    const { error, value: payload } = contactSchema.validate(request.payload)
    if (error) {
      return h.response({ error: error.details[0].message }).code(400)
    }
    try {
      const entity = await createDocument(request.db, contact, payload)
      return h.response({ message: 'success', entity }).code(201)
    } catch (error) {
      return h.response({ error: error.message }).code(500)
    }
  }
}

// Export handlers for use in route definitions
export { findAllDocuments, findDocument, saveDocument }
