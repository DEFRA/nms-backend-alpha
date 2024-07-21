// Import ObjectId from mongodb to handle MongoDB ObjectIds
import { ObjectId } from 'mongodb'
// Import the createLogger function to set up logging
import { createLogger } from '~/src/helpers/logging/logger'

// Create a logger instance for logging information
const logger = createLogger()

/**
 * Creates a new document in the specified MongoDB collection.
 * @param {Object} db - The database connection object.
 * @param {string} collectionName - The name of the collection where the document will be inserted.
 * @param {Object} document - The document to be inserted.
 * @returns {Object|null} - The inserted document if successful, otherwise null.
 * @throws {Error} - Throws an error if the document creation fails.
 */
const createDocument = async (db, collectionName, document) => {
  try {
    const collection = db.collection(collectionName)
    const { acknowledged, insertedId } = await collection.insertOne(document)
    if (acknowledged && insertedId) {
      return await readDocument(db, collectionName, { _id: insertedId })
    }
  } catch (error) {
    logger.error(`Failed to create document in ${collectionName}: ${error}`)
    throw new Error('Failed to create document')
  }
}

/**
 * Updates an existing document in the specified MongoDB collection.
 * @param {Object} db - The database connection object.
 * @param {string} collectionName - The name of the collection where the document will be updated.
 * @param {string} id - The ObjectId of the document to be updated.
 * @param {Object} document - The updated document data.
 * @returns {Object|null} - The updated document if successful, otherwise null.
 * @throws {Error} - Throws an error if the document update fails.
 */
const updateDocument = async (db, collectionName, id, document) => {
  try {
    const collection = db.collection(collectionName)
    const { matchedCount } = await collection.updateOne(
      {
        _id: new ObjectId(id)
      },
      { $set: document }
    )
    if (matchedCount) {
      return await readDocument(db, collectionName, { _id: new ObjectId(id) })
    } else {
      logger.error(
        `Failed to find the document in ${collectionName} with ${id}`
      )
      throw new Error('Failed to find the document')
    }
  } catch (error) {
    logger.error(
      `Failed to update document in ${collectionName} with ${id}: ${error}`
    )
    throw new Error('Failed to update document')
  }
}

/**
 * Reads all documents from the specified MongoDB collection.
 * @param {Object} db - The database connection object.
 * @param {string} collectionName - The name of the collection to read documents from.
 * @returns {Array<Object>} - An array of all documents in the collection.
 * @throws {Error} - Throws an error if reading documents fails.
 */
const readAllDocuments = async (db, collectionName) => {
  try {
    const collection = db.collection(collectionName)
    const result = await collection.find({}).toArray()
    return result
  } catch (error) {
    logger.error(
      `Failed to read all documents from ${collectionName}: ${error}`
    )
    throw new Error('Failed to read documents')
  }
}

/**
 * Reads a specific document from the specified MongoDB collection based on a query.
 * @param {Object} db - The database connection object.
 * @param {string} collectionName - The name of the collection to read the document from.
 * @param {Object} query - The query object to find the document.
 * @returns {Object|null} - The document if found, otherwise null.
 * @throws {Error} - Throws an error if reading the document fails.
 */
const readDocument = async (db, collectionName, query) => {
  try {
    const collection = db.collection(collectionName)
    const result = await collection.findOne(query)
    return result
  } catch (error) {
    logger.error(`Failed to read document from ${collectionName}: ${error}`)
    throw new Error('Failed to read document')
  }
}

// Export the functions for use in other modules
export { createDocument, readAllDocuments, readDocument, updateDocument }
