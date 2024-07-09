import { fetchSubmissions } from '~/src/jobs/fetch-submission'

const submissionJob = {
  handler: async (request, h) => {
    try {
      const data = await fetchSubmissions()

      return h
        .response({
          status: 'success',
          message: 'Job executed successfully',
          ...data
        })
        .code(200)
    } catch (error) {
      return h.response({ error }).code(500)
    }
  }
}

export { submissionJob }
