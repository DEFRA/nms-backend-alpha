import {
  dataverseEntities,
  nationalityValues,
  typeOfDeveloperValues,
  creditSalesStatusValues,
  developerInterestDetails,
  wwtwValues,
  planningUseClassValues
} from '~/src/helpers/constants'
import { proxyAgent } from '~/src/helpers/proxy-agent'
import organizationNContact from '~/src/schema/organizationNContact'
import developmentSite from '~/src/schema/developmentSite'
import { getAccessToken } from '~/src/services/powerapps/auth'
import {
  createData,
  getData,
  getEntityMetadata,
  getOptionSetDefinition,
  updateData
} from '~/src/services/powerapps/dataverse'
import { proxyFetch } from '~/src/helpers/proxy-fetch'
import { createLogger } from '~/src/helpers/logging/logger'
import { processOptions } from './helpers/process-options'

const logger = createLogger()

/**
 * Handler for authentication requests.
 *
 * Fetches an access token and returns it in the response.
 *
 * @param {Object} request - The request object.
 * @param {Object} h - The response toolkit.
 * @returns {Object} - The response object containing the access token or an error message.
 */
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

/**
 * Handler for testing the proxy functionality.
 *
 * Sends a GET request to an external URL using a proxy and returns the response.
 *
 * @param {Object} request - The request object.
 * @param {Object} h - The response toolkit.
 * @returns {Object} - The response object containing the proxy agent information and response text or error details.
 */
const testProxy = {
  handler: async (request, h) => {
    const proxyAgentObj = proxyAgent()
    try {
      const response = await proxyFetch('https://www.google.com', {
        method: 'GET'
      })
      if (response.status >= 200 && response.status < 300) {
        const text = await response.text()
        return h.response({ proxyAgentObj, text })
      } else {
        return h.response({
          message: 'Fetch failed',
          proxyAgentObj,
          status: response.status,
          error: response.statusText
        })
      }
    } catch (error) {
      return h.response({ message: 'error', proxyAgentObj, error })
    }
  }
}

/**
 * Handler for reading documents from the database.
 *
 * Retrieves documents of a specified entity from the database.
 *
 * @param {Object} request - The request object containing the entity name in the parameters.
 * @param {Object} h - The response toolkit.
 * @returns {Object} - The response object containing the fetched documents or an error message.
 */
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

/**
 * Handler for retrieving the metadata of an entity.
 *
 * Fetches the metadata schema of a specified entity from the database.
 *
 * @param {Object} request - The request object containing the entity name in the parameters.
 * @param {Object} h - The response toolkit.
 * @returns {Object} - The response object containing the entity metadata schema or an error message.
 */
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

/**
 * Handler for creating a new document in the database.
 *
 * Saves a new document of a specified entity to the database using the provided data.
 *
 * @param {Object} request - The request object containing the entity name and data in the payload.
 * @param {Object} h - The response toolkit.
 * @returns {Object} - The response object confirming the successful save or an error message.
 */
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

/**
 * Handler for saving an organization and contact document.
 *
 * Validates and saves organization and contact details. Updates the organization with nationality if provided.
 *
 * @param {Object} request - The request object containing the organization and contact data in the payload.
 * @param {Object} h - The response toolkit.
 * @returns {Object} - The response object confirming the successful save or an error message.
 */
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
      const { contact, organization } = dataverseEntities
      const organizationPayload = {
        nm_residentialaddressline1: payload.address1,
        nm_residentialaddressline2: payload.address2,
        nm_residentialaddressline3: payload.address3,
        nm_residentialtownorcity: payload.townRCity,
        nm_residentialpostcode: payload.postcode,
        nm_dateofbirth: payload.dateOfBirth === '' ? null : payload.dateOfBirth,
        nm_typeofdeveloper:
          payload.typeOfDeveloper === ''
            ? null
            : typeOfDeveloperValues[payload.typeOfDeveloper],
        nm_organisationname: payload.orgName === '' ? null : payload.orgName
      }
      const contactPayload = {
        firstname: payload.firstName,
        lastname: payload.lastName,
        nm_telephonenumber: payload.phone,
        nm_email: payload.email,
        nm_Organisation: organizationPayload
      }
      const contactRecord = await createData(contact, contactPayload)
      if (
        contactRecord?.contactid &&
        contactRecord?._nm_organisation_value &&
        payload.nationality
      ) {
        await updateData(organization, contactRecord?._nm_organisation_value, {
          'nm_Nationality@odata.bind': `/nm_countries(${nationalityValues[payload.nationality]})`
        })
      }
      return h
        .response({ message: 'Save successfully', data: contactRecord })
        .code(201)
    } catch (error) {
      return h.response({ error }).code(500)
    }
  }
}

/**
 * Handler for saving a development site document.
 *
 * Validates and saves development site details. Handles various fields with possible null values based on provided data.
 *
 * @param {Object} request - The request object containing the development site data in the payload.
 * @param {Object} h - The response toolkit.
 * @returns {Object} - The response object confirming the successful save or an error message.
 */
const saveDevelopmentSite = {
  handler: async (request, h) => {
    const { error, value: payload } = developmentSite.validate(
      request.payload,
      { abortEarly: false }
    )
    if (error) {
      return h
        .response({ error: error.details.map((detail) => detail.message) })
        .code(400)
    }
    try {
      const { developmentSite } = dataverseEntities
      const developmentSitePayload = {
        nm_sitename: payload.siteName,
        nm_creditsalesstatus:
          payload.creditSalesStatus === ''
            ? null
            : creditSalesStatusValues[payload.creditSalesStatus],
        'nm_DeveloperCompany@odata.bind': `/nm_organisations(${payload.developerCompany})`,
        'nm_DeveloperEmployee@odata.bind': `/contacts(${payload.developerEmployee})`,
        nm_thedevelopersinterestinthedevelopmentsite:
          payload.theDevelopersInterestInTheDevelopmentSite === ''
            ? null
            : developerInterestDetails[
                payload.theDevelopersInterestInTheDevelopmentSite
              ],
        nm_thedeveloperistheapplicant:
          payload.theDeveloperIsTheApplicant === ''
            ? null
            : developerInterestDetails[payload.theDeveloperIsTheApplicant],
        nm_wastewaterconnectiontype:
          payload.wasteWaterConnectionType === ''
            ? null
            : wwtwValues[payload.wasteWaterConnectionType],
        'nm_Catchment@odata.bind': `/nm_catchments(${payload.catchment})`,
        'nm_Subcatchment@odata.bind': `/nm_subcatchmentses(${payload.subCatchment})`,
        'nm_Round@odata.bind': `/nm_recordroundses(${payload.round})`,
        nm_planninguseclassofthisdevelopment:
          payload.planningUseClassOfThisDevelopment === ''
            ? null
            : planningUseClassValues[payload.planningUseClassOfThisDevelopment],
        nm_numberofunitstobebuilt: payload.numberOfUnitsToBeBuilt,
        nm_smedeveloper: payload.smeDeveloper === 'Yes',
        'nm_LPAs@odata.bind': `/nm_lpas(${payload.lpas})`,
        nm_planningpermission: payload.planningPermission === 'Yes',
        nm_phaseddevelopment: payload.phasedDevelopment === 'Yes',
        nm_gridreference: payload.gridReference,
        nm_haveyouincludedamapoftheproposedredlineb:
          payload.haveYouIncludedTheProposedRedLineB === 'Yes'
            ? 930750000
            : 930750001,
        nm_enquirydaterecieved: payload?.enquiryDateRecieved ?? null,
        nm_applicationreceivedtime: payload.applicationreceivedtime,
        nm_customerduediligencecheckneeded:
          payload.customerDueDiligenceCheckNeeded === 'Yes',
        nm_urn: payload.urn,
        nm_folderpath: payload.folderPath
      }
      logger.info(
        'developmentSitePayload >> ' + JSON.stringify(developmentSitePayload)
      )
      const developmentSiteRecord = await createData(
        developmentSite,
        developmentSitePayload
      )
      return h
        .response({ message: 'Save successfully', data: developmentSiteRecord })
        .code(201)
    } catch (error) {
      return h.response({ error }).code(500)
    }
  }
}

/**
 * Handler for retrieving option sets from the database and processing them.
 *
 * Fetches option sets for a specified entity, processes them to extract values and labels, and returns them in the response.
 *
 * @param {Object} request - The request object containing the entity name in the parameters.
 * @param {Object} h - The response toolkit.
 * @returns {Object} - The response object containing the processed options or an error message.
 */
const readOptionsController = {
  handler: async (request, h) => {
    try {
      const { entity } = request.params
      const options = await getOptionSetDefinition(entity)
      const optionsSet = await processOptions(
        options?.Options ?? null,
        'Value',
        'Label.UserLocalizedLabel.Label'
      )
      return h.response({ message: 'success', data: optionsSet }).code(200)
    } catch (error) {
      logger.error(error)
      return h.response({ error: error.message }).code(500)
    }
  }
}

/**
 * Handler for reading entity data as options.
 *
 * Fetches data for a specified entity and processes it to create an options set with values and labels.
 *
 * @param {Object} request - The request object containing the entity name in the parameters.
 * @param {Object} h - The response toolkit.
 * @returns {Object} - The response object containing the processed options or an error message.
 */
const readEntityAsOptionsController = {
  handler: async (request, h) => {
    try {
      const { entity } = request.params
      const options = await getData(entity)
      const optionsSet = await processOptions(
        options?.value ?? null,
        'nm_countryid',
        'nm_name'
      )
      return h.response({ message: 'success', data: optionsSet }).code(200)
    } catch (error) {
      logger.error(error)
      return h.response({ error: error.message }).code(500)
    }
  }
}

export {
  authController,
  readController,
  postController,
  getEntitySchema,
  saveOrganizationNContact,
  saveDevelopmentSite,
  testProxy,
  readOptionsController,
  readEntityAsOptionsController
}
