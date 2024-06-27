import {
  authController,
  getEntitySchema,
  postController,
  readController,
  saveOrganizationNContact,
  saveDevelopmentSite
} from '~/src/api/dataverse/controller'

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
          path: '/entity-schema/{entity}',
          ...getEntitySchema
        },
        {
          method: 'POST',
          path: '/save-development-site',
          ...saveDevelopmentSite
        }
      ])
    }
  }
}

export { dataverse }
