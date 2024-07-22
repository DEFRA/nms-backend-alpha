// Import the jobManager module to manage scheduled jobs
import jobManager from './job-manager'
// Import the createLogger function to set up logging
import { createLogger } from '../logging/logger'
// Import the fetchSubmissions function which will be used as a scheduled task
import { fetchSubmissions } from '../../jobs/fetch-submission'

// Create a logger instance for logging information
const logger = createLogger()

/**
 * Function to schedule jobs.
 * This function schedules a job named 'fetch-submission' to run daily at 23:59.
 * The job logs a message indicating it is running and then executes the fetchSubmissions function.
 */
const scheduledJobs = () => {
  jobManager.scheduleJob(
    'fetch-submission',
    '59 23 * * *',
    async () => {
      // Log the start of the fetch submission job
      logger.info('Running the fetch submission job')
      // Execute the fetchSubmissions function
      await fetchSubmissions()
    },
    {
      // Ensure the job is scheduled and specify the timezone as 'Europe/London'
      scheduled: true,
      timezone: 'Europe/London'
    }
  )
}

// Export the scheduledJobs function as the default export of this module
export default scheduledJobs
