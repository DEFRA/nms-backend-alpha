import {
  authController,
  postController,
  readController,
  saveOrganizationNContact
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
        }
      ])
    }
  }
}

export { dataverse }
