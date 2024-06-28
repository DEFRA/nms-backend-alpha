import { ConfidentialClientApplication } from '@azure/msal-node'
import { config } from '~/src/config'
import { proxyFetch } from '~/src/helpers/proxy-fetch'

const tenantId = config.get('azTenantId')
const clientId = config.get('azClientId')
const clientSecret = config.get('azClientSecret')
const resourceUrl = config.get('dataverseUri')

const azConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    clientSecret
  },
  system: {
    networkClient: {
      sendGetRequestAsync: async (url, options) => {
        return proxyFetch(url, options)
      },
      sendPostRequestAsync: async (url, options) => {
        return proxyFetch(url, { ...options, method: 'POST' })
      }
    }
  }
}

const client = new ConfidentialClientApplication(azConfig)

const getAccessToken = async () => {
  const tokenRequest = {
    scopes: [`${resourceUrl}.default`]
  }
  try {
    const tokenResponse =
      await client.acquireTokenByClientCredential(tokenRequest)
    return await tokenResponse?.accessToken
  } catch (error) {
    throw new Error('Failed to acquire token')
  }
}

export { getAccessToken }
