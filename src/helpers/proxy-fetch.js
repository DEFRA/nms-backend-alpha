import { config } from '~/src/config'
import { ProxyAgent, fetch as undiciFetch } from 'undici'
import { createLogger } from './logging/logger'

const logger = createLogger()

const nonProxyFetch = (url, opts) => {
  return undiciFetch(url, {
    ...opts
  })
}

const proxyFetch = (url, opts, skipProxy = false) => {
  const proxy = config.get('httpsProxy') ?? config.get('httpProxy')
  if (!proxy || skipProxy) {
    return nonProxyFetch(url, opts)
  } else {
    return undiciFetch(url, {
      ...opts,
      dispatcher: new ProxyAgent({
        uri: proxy,
        keepAliveTimeout: 10,
        keepAliveMaxTimeout: 10
      })
    })
  }
}

const proxyFetchWithoutOpts = (url, skipProxy = false) => {
  const proxy = config.get('httpsProxy') ?? config.get('httpProxy')
  const proxyMsg = `Proxy from config: ${proxy}`
  logger.info(proxyMsg)
  if (!proxy || skipProxy) {
    return nonProxyFetch(url)
  } else {
    return undiciFetch(url, {
      dispatcher: new ProxyAgent({
        uri: proxy,
        keepAliveTimeout: 10,
        keepAliveMaxTimeout: 10
      })
    })
  }
}

export { proxyFetch, proxyFetchWithoutOpts }
