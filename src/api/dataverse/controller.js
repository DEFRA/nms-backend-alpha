import { dataverseEntities } from '~/src/helpers/constants'
import organizationNContact from '~/src/schema/organizationNContact'
import { getAccessToken } from '~/src/services/powerapps/auth'
import {
  createData,
  getData,
  getEntityMetadata
} from '~/src/services/powerapps/dataverse'

const authController = {
  handler: async (request, h) => {
    try {
      const token = await getAccessToken()
      return h.response({ message: 'success', token }).code(200)
    } catch (error) {
      return h.response({ error }).code(500)
    }
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

const getEntitySchema = {
  handler: async (request, h) => {
    try {
      const { entity } = request.params
      const schema = await getEntityMetadata(entity)
      return h.response({ message: 'success', data: schema }).code(200)
    } catch (error) {
      return h.response({ error: error.message }).code(500)
    }
  }
}

const postController = {
  handler: async (request, h) => {
    try {
      const {
        params: { entity },
        payload: entityData
      } = request
      await createData(entity, entityData)
      return h.response({ message: 'Save successfully' }).code(200)
    } catch (error) {
      return h.response({ error: error.message }).code(500)
    }
  }
}

const saveOrganizationNContact = {
  handler: async (request, h) => {
    const { error, value: payload } = organizationNContact.validate(
      request.payload,
      { abortEarly: false }
    )
    if (error) {
      return h
        .response({ error: error.details.map((detail) => detail.message) })
        .code(400)
    }
    try {
      const { contact } = dataverseEntities
      const organizationPayload = {
        nm_residentialaddressline1: payload.address1,
        nm_residentialaddressline2: payload.address2,
        nm_residentialaddressline3: payload.address3,
        nm_residentialtownorcity: payload.townRCity,
        nm_residentialpostcode: payload.postcode,
        nm_dateofbirth: payload.dateOfBirth ?? null,
        nm_typeofdeveloper: payload.typeOfDeveloper ?? null,
        nm_organisationname: payload.orgName ?? null
        // nm_nationality: payload.nationality
      }

      const contactPayload = {
        firstname: payload.firstName,
        lastname: payload.lastName,
        nm_telephonenumber: payload.phone,
        nm_email: payload.email,
        nm_Organisation: organizationPayload
      }

      const contactRecord = await createData(contact, contactPayload)
      return h
        .response({ message: 'Save successfully', data: contactRecord })
        .code(201)
    } catch (error) {
      return h.response({ error }).code(500)
    }
  }
}

export {
  authController,
  readController,
  postController,
  getEntitySchema,
  saveOrganizationNContact
}
