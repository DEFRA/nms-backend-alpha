import { mongoCollections, schemaMapping } from '~/src/helpers/constants'
import { updateDocument } from '~/src/helpers/databaseTransaction'

const updateController = {
  handler: async (request, h) => {
    const { entity, ...payload } = request.payload
    const { id, collection } = request.params
    try {
      const { error } = schemaMapping[entity].validate(request.payload)
      if (error) {
        return h.response({ error: error.details[0].message }).code(400)
      }
      const document = await updateDocument(
        request.db,
        mongoCollections[collection],
        id,
        payload
      )
      return h.response({ message: 'success', document }).code(201)
    } catch (error) {
      return h.response({ error: error.message }).code(500)
    }
  }
}

export default updateController
