import {
  authController,
  postController,
  readController,
  saveOrganizationNContact
} from '~/src/api/dataverse/controller'
import { getEntityMetadata } from '~/src/services/powerapps/dataverse'

const dataverse = {
  plugin: {
    name: 'dataverse',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/dataverse',
          ...authController
        },
        {
          method: 'GET',
          path: '/dataverse-read/{entity}',
          ...readController
        },
        {
          method: 'POST',
          path: '/dataverse-save/{entity}',
          ...postController
        },
        {
          method: 'POST',
          path: '/save-organization-contact',
          ...saveOrganizationNContact
        },
        {
          method: 'GET',
          path: '/entity-schema',
          ...getEntityMetadata
        }
      ])
    }
  }
}

export { dataverse }
