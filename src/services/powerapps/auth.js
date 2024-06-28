import { ConfidentialClientApplication } from '@azure/msal-node'
import { proxyAgent } from '~/src/helpers/proxy-agent'
import { config } from '~/src/config'

const tenantId = config.get('azTenantId')
const clientId = config.get('azClientId')
const clientSecret = config.get('azClientSecret')
const resourceUrl = config.get('dataverseUri')
const proxyAgentObj = proxyAgent()

const azConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    clientSecret
  },
  ...(proxyAgentObj && {
    system: {
      networkClient: {
        sendGetRequestAsync: async (url, options) => {
          return await fetch(url, { ...options, agent: proxyAgentObj.agent })
        },
        sendPostRequestAsync: async (url, options) => {
          const sendingOptions = options || {}
          sendingOptions.method = 'post'
          return await fetch(url, {
            ...sendingOptions,
            agent: proxyAgentObj.agent
          })
        }
      }
    }
  })
}

const client = new ConfidentialClientApplication(azConfig)

const getAccessToken = async () => {
  const tokenRequest = {
    scopes: [`${resourceUrl}.default`]
  }
  try {
    const tokenResponse =
      await client.acquireTokenByClientCredential(tokenRequest)
    return tokenResponse?.accessToken
  } catch (error) {
    throw new Error('Failed to acquire token')
  }
}

export { getAccessToken }
