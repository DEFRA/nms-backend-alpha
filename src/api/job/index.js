import { submissionJob } from './controllers/submission-job'

const jobs = {
  plugin: {
    name: 'jobs',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/job-submission',
          ...submissionJob
        }
      ])
    }
  }
}

export { jobs }
