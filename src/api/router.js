import { health } from '~/src/api/health'
import { example } from '~/src/api/example'
import { dataverse } from '~/src/api/dataverse'
import { contacts } from '~/src/api/contacts'
import { crud } from './crud-transaction/index'
import { jobs } from './job/index'
import { sharePoint } from './sharepoint/index'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Application specific routes, add your own routes here.
      await server.register([example])
      await server.register([dataverse, contacts, crud, jobs, sharePoint])
    }
  }
}

export { router }
