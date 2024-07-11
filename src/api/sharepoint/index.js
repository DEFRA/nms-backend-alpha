import { indexController } from '~/src/api/sharepoint/controllers/index'

const sharePoint = {
  plugin: {
    name: 'sharePoint',
    register: async (server) => {
      server.route({
        method: 'GET',
        path: '/sharepoint',
        ...indexController
      })
    }
  }
}

export { sharePoint }
