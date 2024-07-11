import convict from 'convict'
import path from 'path'

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3001,
    env: 'PORT'
  },
  serviceName: {
    doc: 'Api Service Name',
    format: String,
    default: 'nms-backend-alpha'
  },
  root: {
    doc: 'Project root',
    format: String,
    default: path.normalize(path.join(__dirname, '..', '..'))
  },
  isProduction: {
    doc: 'If this application running in the production environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'production'
  },
  isDevelopment: {
    doc: 'If this application running in the development environment',
    format: Boolean,
    default: process.env.NODE_ENV !== 'production'
  },
  isTest: {
    doc: 'If this application running in the test environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'test'
  },
  logLevel: {
    doc: 'Logging level',
    format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
    default: 'info',
    env: 'LOG_LEVEL'
  },
  mongoUri: {
    doc: 'URI for mongodb',
    format: '*',
    default: 'mongodb://127.0.0.1:27017/',
    env: 'MONGO_URI'
  },
  mongoDatabase: {
    doc: 'database for mongodb',
    format: String,
    default: 'nms-backend-alpha',
    env: 'MONGO_DATABASE'
  },
  httpProxy: {
    doc: 'HTTP Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTP_PROXY'
  },
  httpsProxy: {
    doc: 'HTTPS Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTPS_PROXY'
  },
  azTenantId: {
    doc: 'The azure tenant ID',
    format: String,
    required: true,
    default: null,
    env: 'AZ_TENANT_ID',
    sensitive: true
  },
  azClientId: {
    doc: 'The azure client ID',
    format: String,
    required: true,
    default: null,
    env: 'AZ_CLIENT_ID',
    sensitive: true
  },
  azClientSecret: {
    doc: 'The azure client secret',
    format: String,
    required: true,
    default: null,
    env: 'AZ_CLIENT_SECRET',
    sensitive: true
  },
  dataverseUri: {
    doc: 'The power apps dataverse URI',
    format: String,
    default: 'https://defra-nutrientmitigation-dev.crm11.dynamics.com/',
    env: 'DATAVERSE_URI'
  },
  awsRegion: {
    doc: 'AWS region',
    format: String,
    default: 'eu-west-2',
    env: 'AWS_REGION'
  },
  localstackEndpoint: {
    doc: 'Localstack endpoint',
    format: String,
    default: 'http://localhost:4566'
  },
  bucket: {
    doc: 'Bucket name',
    format: String,
    default: 'nms-local-frontend',
    env: 'BUCKET'
  }
})

config.validate({ allowed: 'strict' })

export { config }
