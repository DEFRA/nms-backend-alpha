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
      const { organization, contact } = dataverseEntities
      const organizationPayload = {
        nm_ResidentialAddressline1: payload.address1,
        nm_ResidentialAddressline2: payload.address2,
        nm_ResidentialAddressline3: payload.address3,
        nm_ResidentialTownorcity: payload.townRCity,
        nm_ResidentialPostcode: payload.postcode,
        nm_Dateofbirth: payload.dateOfBirth,
        nm_Typeofdeveloper: payload.typeOfDeveloper,
        nm_Nationality: payload.nationality
      }

      const organizationRecord = await createData(
        organization,
        organizationPayload
      )
      const organizationId = organizationRecord.nm_organisationid

      const contactPayload = {
        FirstName: payload.firstName,
        LastName: payload.lastName,
        nm_TelephoneNumber: payload.phone,
        nm_Email: payload.email,
        nm_Organisation: organizationId
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
