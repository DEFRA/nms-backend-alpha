import { indexController } from '~/src/api/sharepoint/controllers/index'

const sharePoint = {
  plugin: {
    name: 'sharePoint',
    register: async (server) => {
      server.route({
        method: 'GET',
        path: '/sharepoint/{collection}/{id}',
        ...indexController
      })
    }
  }
}

export { sharePoint }
