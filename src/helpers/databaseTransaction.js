import { ObjectId } from 'mongodb'
import { createLogger } from '~/src/helpers/logging/logger'

const logger = createLogger()

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

export { createDocument, readAllDocuments, readDocument, updateDocument }
