import { fetchSubmissions } from '~/src/jobs/fetch-submission'

/**
 * A job handler for fetching and returning submission data.
 *
 * This handler invokes the `fetchSubmissions` function to retrieve submission data and returns it in the response. If the operation is successful, it responds with a success status and the fetched data. In case of an error, it returns an error response.
 *
 * @type {Object}
 * @property {Function} handler - The function to handle incoming requests. It is an asynchronous function that fetches submission data and returns it in the response.
 *
 * @param {Object} request - The request object, which contains the incoming request details.
 * @param {Object} h - The response toolkit used to build and return the HTTP response.
 *
 * @returns {Object} - The response object, which includes:
 *   - `status` (string): The status of the job execution ('success' or 'error').
 *   - `message` (string): A message indicating the outcome of the job ('Job executed successfully' or an error message).
 *   - `data` (Object): The submission data fetched by the `fetchSubmissions` function, if the operation is successful.
 *
 * @throws {Error} - Returns an error response with a status code of 500 if an exception occurs during the execution of `fetchSubmissions`.
 */
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
