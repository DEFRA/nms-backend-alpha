// Import ConfidentialClientApplication from @azure/msal-node to handle Azure AD authentication
import { ConfidentialClientApplication } from '@azure/msal-node'
// Import configuration settings
import { config } from '~/src/config'
// Import HTTP request functions for the auth proxy client
import { sendGetRequestAsync, sendPostRequestAsync } from './authProxyClient'

// Retrieve configuration values for Azure AD authentication
const tenantId = config.get('azTenantId')
const clientId = config.get('azClientId')
const clientSecret = config.get('azClientSecret')
const resourceUrl = config.get('dataverseUri')

// Configure the Azure AD authentication parameters
const azConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    clientSecret
  },
  system: {
    networkClient: { sendGetRequestAsync, sendPostRequestAsync }
  }
}

// Create an instance of ConfidentialClientApplication with the specified configuration
const client = new ConfidentialClientApplication(azConfig)

/**
 * Acquires an access token from Azure AD using client credentials.
 * @returns {string} - The access token if successfully acquired.
 * @throws {Error} - Throws an error if the token acquisition fails.
 */
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

/**
 * Acquires an access token from Azure AD using client credentials.
 * @returns {string} - The access token if successfully acquired.
 * @throws {Error} - Throws an error if the token acquisition fails.
 */
const getSPAccessToken = async () => {
  const tokenRequest = {
    scopes: [`https://graph.microsoft.com/.default`]
  }
  try {
    const tokenResponse =
      await client.acquireTokenByClientCredential(tokenRequest)
    return tokenResponse?.accessToken
  } catch (error) {
    throw new Error('Failed to acquire SharePoint token')
  }
}

// Export the getAccessToken function for use in other modules
export { getAccessToken, getSPAccessToken }
