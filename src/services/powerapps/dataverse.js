// Import configuration settings
import { config } from '~/src/config'
// Import the getAccessToken function for authentication
import { getAccessToken } from './auth'
// Import the fetchProxyWrapper function for making HTTP requests
import { fetchProxyWrapper } from '~/src/helpers/fetchProxyWrapper'
// Import the createLogger function to set up logging
import { createLogger } from '~/src/helpers/logging/logger'

// Get the Dataverse URI from the configuration
const resourceUrl = config.get('dataverseUri')
// Set the base URL for the Dataverse API
const apiBaseUrl = `${resourceUrl}api/data/v9.1`
// Create a logger instance for logging information
const logger = createLogger()

/**
 * Generates headers required for authenticated API requests.
 * @returns {Object} - The headers object containing authorization and content-type information.
 * @throws {Error} - Throws an error if token acquisition fails.
 */
const getHeaders = async () => {
  const token = await getAccessToken()
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'OData-MaxVersion': '4.0',
    'OData-Version': '4.0',
    Prefer: 'return=representation'
  }
}

/**
 * Retrieves data from a specified Dataverse entity.
 * @param {string} entity - The name of the Dataverse entity.
 * @returns {Object} - The response body containing the retrieved data.
 * @throws {Error} - Throws an error if the GET request fails.
 */
const getData = async (entity) => {
  try {
    const headers = await getHeaders()
    const response = await fetchProxyWrapper(`${apiBaseUrl}/${entity}`, {
      headers
    })
    return response.body
  } catch (error) {
    logger.error(`Get Data failed: ${error.message}`)
    throw error
  }
}

/**
 * Creates a new record in a specified Dataverse entity.
 * @param {string} entity - The name of the Dataverse entity.
 * @param {Object} data - The data to create the new record with.
 * @returns {Object} - The response body containing the created data.
 * @throws {Error} - Throws an error if the POST request fails.
 */
const createData = async (entity, data) => {
  try {
    const headers = await getHeaders()
    const response = await fetchProxyWrapper(`${apiBaseUrl}/${entity}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers
    })
    return response.body
  } catch (error) {
    logger.error(`Create Data failed: ${error.message}`)
    throw error
  }
}

/**
 * Updates an existing record in a specified Dataverse entity.
 * @param {string} entity - The name of the Dataverse entity.
 * @param {string} id - The ID of the record to update.
 * @param {Object} data - The data to update the record with.
 * @returns {Object} - The response body containing the updated data.
 * @throws {Error} - Throws an error if the PUT request fails.
 */
const updateData = async (entity, id, data) => {
  try {
    const headers = await getHeaders()
    const response = await fetchProxyWrapper(`${apiBaseUrl}/${entity}(${id})`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers
    })
    return response.body
  } catch (error) {
    logger.error(`Update Data failed: ${error.message}`)
    throw error
  }
}

/**
 * Deletes a record from a specified Dataverse entity.
 * @param {string} entity - The name of the Dataverse entity.
 * @param {string} id - The ID of the record to delete.
 * @returns {Object} - A message indicating successful deletion.
 * @throws {Error} - Throws an error if the DELETE request fails.
 */
const deleteData = async (entity, id) => {
  try {
    const headers = await getHeaders()
    await fetchProxyWrapper(`${apiBaseUrl}/${entity}(${id})`, {
      method: 'DELETE',
      headers
    })
    return { message: 'Data deleted successfully' }
  } catch (error) {
    logger.error(`Delete Data failed: ${error.message}`)
    throw error
  }
}

/**
 * Creates a new table in the Dataverse.
 * @param {Object} tableDefinition - The definition of the table to create.
 * @returns {Object} - The response body containing the created table data.
 * @throws {Error} - Throws an error if the table creation fails.
 */
const createTable = async (tableDefinition) => {
  try {
    const headers = await getHeaders()
    const response = await fetchProxyWrapper(
      `${apiBaseUrl}/EntityDefinitions`,
      {
        method: 'POST',
        body: JSON.stringify(tableDefinition),
        headers
      }
    )
    return response.body
  } catch (error) {
    logger.error(`Create table failed: ${error.message}`)
    throw error
  }
}

/**
 * Creates a new column in an existing Dataverse table.
 * @param {string} tableName - The logical name of the table.
 * @param {Object} columnDefinition - The definition of the column to create.
 * @returns {Object} - The response body containing the created column data.
 * @throws {Error} - Throws an error if the column creation fails.
 */
const createColumn = async (tableName, columnDefinition) => {
  try {
    const headers = await getHeaders()
    const response = await fetchProxyWrapper(
      `${apiBaseUrl}/EntityDefinitions(LogicalName='${tableName}')/Attributes`,
      {
        method: 'POST',
        body: JSON.stringify(columnDefinition),
        headers
      }
    )
    return response.body
  } catch (error) {
    logger.error(`Create column failed: ${error.message}`)
    throw error
  }
}

/**
 * Retrieves metadata for a specified Dataverse entity.
 * @param {string} entity - The logical name of the entity.
 * @returns {Object} - The response body containing the entity metadata.
 * @throws {Error} - Throws an error if the metadata retrieval fails.
 */
const getEntityMetadata = async (entity) => {
  try {
    const headers = await getHeaders()
    const response = await fetchProxyWrapper(
      `${apiBaseUrl}/EntityDefinitions(LogicalName='${entity}')`,
      {
        method: 'POST',
        headers
      }
    )
    return response.body
  } catch (error) {
    logger.error(`Get Entity Metadata failed: ${error.message}`)
    throw error
  }
}

/**
 * Retrieves the definition of a global option set for a specified entity.
 * @param {string} entity - The logical name of the entity.
 * @returns {Object} - The response body containing the option set definition.
 * @throws {Error} - Throws an error if the option set definition retrieval fails.
 */
const getOptionSetDefinition = async (entity) => {
  try {
    const headers = await getHeaders()
    const response = await fetchProxyWrapper(
      `${apiBaseUrl}/GlobalOptionSetDefinitions(Name='${entity}')`,
      {
        headers
      }
    )
    return response.body
  } catch (error) {
    logger.error(`Get Option Set Definition failed: ${error.message}`)
    throw error
  }
}

/**
 * Uploads a file to SharePoint.
 * @param {string} uploadUrl - The URL to upload the file to.
 * @param {Buffer} fileBuffer - The file buffer to upload.
 * @returns {Object} - The response body containing the upload result.
 * @throws {Error} - Throws an error if the file upload fails.
 */
const uploadToSharePoint = async (uploadUrl, fileBuffer) => {
  // const token = getSPAccessToken()
  const options = {
    method: 'POST',
    headers: {
      // Authorization: `Bearer ${token}`,
      Accept: 'application/json;odata=verbose',
      'Content-Type': 'application/octet-stream'
    },
    // body: fileBuffer,
    body: {
      key: 'Text sent by Node App'
    },
    duplex: 'half'
  }
  try {
    logger.info('Upload URL >>> ' + uploadUrl)
    const response = await fetchProxyWrapper(uploadUrl, options)
    return response.body
  } catch (error) {
    logger.info(`Error uploading file to SharePoint: ${error}`)
    throw error
  }
}

const callLogicApp = async (logicAppUrl) => {
  try {
    logger.info(`Logic App URL inside callLogicApp >>> ${logicAppUrl} `)
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json;odata=verbose',
        'Content-Type': 'application/octet-stream'
      },
      body: {
        key: 'Text sent by Node App'
      },
      duplex: 'half'
    }
    logger.info(options)
    const input = JSON.parse(options)
    logger.info(input)
    // const response = await fetchProxyWrapper(logicAppUrl, options)
    // logger.info(`Logic App Response >>> ${response.body} `)
    // return response.body
  } catch (error) {
    logger.info(`Error uploading file to LogicApp: ${error}`)
    throw error
  }
}

// Export functions for use in other modules
export {
  getData,
  createData,
  updateData,
  deleteData,
  createTable,
  createColumn,
  getEntityMetadata,
  getOptionSetDefinition,
  uploadToSharePoint,
  callLogicApp
}
