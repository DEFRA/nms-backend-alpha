import { getAccessToken } from '~/src/services/powerapps/auth'
import { getData } from '~/src/services/powerapps/dataverse'

const authController = {
  handler: async (request, h) => {
    const token = await getAccessToken()
    return h.response({ message: 'success', token }).code(200)
  }
}

const readController = {
  handler: async (request, h) => {
    try {
      const { entity } = request.params
      const accounts = await getData(entity)
      return h.response({ message: 'success', data: accounts }).code(200)
    } catch (error) {
      return h.response({ error: error.message }).code(500)
    }
  }
}

export { authController, readController }
