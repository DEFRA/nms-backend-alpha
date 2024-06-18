import {
  findAllDocuments,
  findDocument,
  saveDocument
} from '~/src/api/contacts/controller'

const contacts = {
  plugin: {
    name: 'contacts',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/contacts',
          ...findAllDocuments
        },
        {
          method: 'GET',
          path: '/contacts/{id}',
          ...findDocument
        },
        {
          method: 'POST',
          path: '/contacts',
          ...saveDocument
        }
      ])
    }
  }
}

export { contacts }
