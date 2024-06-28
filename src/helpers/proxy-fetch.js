import { config } from '~/src/config'
import { ProxyAgent, fetch as undiciFetch } from 'undici'

const nonProxyFetch = async (url, opts) => {
  return await undiciFetch(url, {
    ...opts
  })
}

const proxyFetch = async (url, opts) => {
  const proxy = config.get('httpsProxy') ?? config.get('httpProxy')
  if (!proxy) {
    return await nonProxyFetch(url, opts)
  } else {
    return await undiciFetch(url, {
      ...opts,
      dispatcher: new ProxyAgent({
        uri: proxy,
        keepAliveTimeout: 10,
        keepAliveMaxTimeout: 10
      })
    })
  }
}

export { proxyFetch }
