import axios from 'axios'
import { config } from '~/src/config'
import { getAccessToken } from './auth'

const resourceUrl = config.get('dataverseUri')
const apiBaseUrl = `${resourceUrl}api/data/v9.1`

const getHeaders = async () => {
  const token = await getAccessToken()
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'OData-MaxVersion': '4.0',
    'OData-Version': '4.0'
  }
}

const getData = async (entity) => {
  const headers = await getHeaders()
  const response = await axios.get(`${apiBaseUrl}/${entity}`, { headers })
  return response.data
}

const createData = async (entity, data) => {
  const headers = await getHeaders()
  const response = await axios.post(`${apiBaseUrl}/${entity}`, data, {
    headers
  })
  return response.data
}

const updateData = async (entity, id, data) => {
  const headers = await getHeaders()
  const response = await axios.patch(`${apiBaseUrl}/${entity}(${id})`, data, {
    headers
  })
  return response.data
}

const deleteData = async (entity, id) => {
  const headers = await getHeaders()
  await axios.delete(`${apiBaseUrl}/${entity}(${id})`, { headers })
  return { message: 'Data deleted successfully' }
}

const createTable = async (tableDefinition) => {
  const headers = await getHeaders()
  const response = await axios.post(
    `${apiBaseUrl}/EntityDefinitions`,
    tableDefinition,
    { headers }
  )
  return response.data
}

const createColumn = async (tableName, columnDefinition) => {
  const headers = await getHeaders()
  const response = await axios.post(
    `${apiBaseUrl}/EntityDefinitions(LogicalName='${tableName}')/Attributes`,
    columnDefinition,
    { headers }
  )
  return response.data
}

export {
  getData,
  createData,
  updateData,
  deleteData,
  createTable,
  createColumn
}
