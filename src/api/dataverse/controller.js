import {
  dataverseEntities,
  nationalityValues,
  typeOfDeveloperValues
  // creditSalesStatusValues,
  // developerInterestDetails
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
import { config } from '~/src/config/index'
import { proxyFetch } from '~/src/helpers/proxy-fetch'
import { createLogger } from '~/src/helpers/logging/logger'
import { processOptions } from './helpers/process-options'

const logger = createLogger()

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

const saveDevelopmentSite = {
  handler: async (request, h) => {
    // const { error, value: payload } = developmentSite.validate(
    const { error } = developmentSite.validate(request.payload, {
      abortEarly: false
    })
    if (error) {
      return h
        .response({ error: error.details.map((detail) => detail.message) })
        .code(400)
    }
    return h.response(config)
    // try {
    //   const { developmentSite } = dataverseEntities
    //   const developmentSitePayload = {
    //     // nm_DevelopmentSiteId: payload.address1,
    //     nm_Catchment: payload.catchment,
    //     nm_Certificateextensionrequired:
    //       payload.certificateExtensionRequired === 'Yes' ? 1 : 0,
    //     nm_CreditSalesStatus:
    //       payload.creditSalesStatus === ''
    //         ? null
    //         : creditSalesStatusValues(payload.creditSalesStatus),
    //     nm_Customerduediligencecheckneeded:
    //       payload.customerDueDiligenceCheckNeeded === 'Yes' ? 1 : 0,
    //     nm_DeveloperCompany: payload.developerCompany,
    //     nm_GridReference: payload.gridReference,
    //     nm_LPAs: payload.lpas,
    //     nm_NumberofUnitstoBeBuilt: payload.numberOfUnitsToBeBuilt,
    //     OwnerId: payload.ownerId,
    //     nm_PhasedDevelopment: payload.phasedDevelopment === 'Yes' ? 1 : 0,
    //     nm_PlanningPermission: payload.planningPermission === 'Yes' ? 1 : 0,
    //     nm_SiteName: payload.siteName,
    //     nm_SMEDeveloper: payload.smeDeveloper === 'Yes' ? 1 : 0,
    //     statecode: payload.stateCode,
    //     nm_Subcatchments: payload.subCatchments,
    //     nm_Thedeveloperistheapplicant:
    //       payload.theDeveloperIsTheApplicant === ''
    //         ? null
    //         : developerInterestDetails(payload.theDeveloperIsTheApplicant),
    //     nm_Thedevelopersinterestinthedevelopmentsite:
    //       payload.theDevelopersInterestInTheDevelopmentSite === ''
    //         ? null
    //         : developerInterestDetails(
    //             payload.theDevelopersInterestInTheDevelopmentSite
    //           ),
    //     nm_Haveyouincludedamapoftheproposedredlineb:
    //       payload.haveYouIncludedTheProposedRedLineB === 'Yes' ? 1 : 0
    //   }

    //   const developmentSiteRecord = await createData(
    //     developmentSite,
    //     developmentSitePayload
    //   )

    //   return h
    //     .response({ message: 'Save successfully', data: developmentSiteRecord })
    //     .code(201)
    // } catch (error) {
    //   return h.response({ error }).code(500)
    // }
    // //
  }
}

const readOptionsController = {
  handler: async (request, h) => {
    try {
      const { entity } = request.params
      const options = await getOptionSetDefinition(entity)
      const optionsSet = await processOptions(
        options?.Options ?? null,
        'Value',
        'Label.UserLUserLocalizedLabel.Label'
      )
      return h.response({ message: 'success', data: optionsSet }).code(200)
    } catch (error) {
      logger.error(error)
      return h.response({ error: error.message }).code(500)
    }
  }
}

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
