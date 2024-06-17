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

export { createDocument, readAllDocuments, readDocument }
