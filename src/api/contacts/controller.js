import { mongoCollections } from '~/src/helpers/constants'
import {
  createDocument,
  readAllDocuments,
  readDocument
} from '~/src/helpers/database-transaction'
import contactSchema from '~/src/schema/contact'

const { contact } = mongoCollections

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

const saveDocument = {
  handler: async (request, h) => {
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

export { findAllDocuments, findDocument, saveDocument }
