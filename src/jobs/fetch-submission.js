// Import the createLogger function to set up logging
import { createLogger } from '../helpers/logging/logger'
// Import the jobManager to manage scheduled jobs
import jobManager from '../helpers/jobs/job-manager'

// Create a logger instance for logging information
const logger = createLogger()

/**
 * Fetches submission data as part of a cron job scheduler.
 * Logs and returns a data object containing a message and the current jobs managed by the jobManager.
 * @returns {Object} - An object containing a message and the list of jobs.
 * @throws {Error} - Throws an error if the operation fails.
 */
const fetchSubmissions = async () => {
  try {
    logger.info({
      data: 'This is from cron job scheduler',
      jobs: jobManager.getJobs()
    })
    return {
      data: 'This is from cron job scheduler',
      jobs: jobManager.getJobs()
    }
  } catch (error) {
    logger.info(error)
    throw error
  }
}

// Export the fetchSubmissions function for use in other modules
export { fetchSubmissions }
