// Import the cron module for scheduling jobs
import cron from 'node-cron'
// Import the createLogger function to set up logging
import { createLogger } from '../logging/logger'

/**
 * Class representing a Job Manager to handle scheduling, tracking, and manual execution of jobs.
 */
class JobManager {
  /**
   * Create a Job Manager.
   * Initializes an empty tasks object to store job details and a logger instance for logging information.
   */
  constructor() {
    this.tasks = {}
    this.logger = createLogger()
  }

  /**
   * Schedule a job.
   * @param {string} name - The name of the job.
   * @param {string} cronTime - The cron time string specifying the schedule.
   * @param {Function} jobFunction - The function to execute at the scheduled time.
   * @param {Object} options - Additional options for scheduling.
   * @returns {Object} - The scheduled job instance.
   */
  scheduleJob(name, cronTime, jobFunction, options) {
    const job = cron.schedule(cronTime, jobFunction, options)
    this.tasks[name] = { job, cronTime, lastExecuted: null }
    return job
  }

  /**
   * Get details of all scheduled jobs.
   * @returns {Array<Object>} - An array of job details including name, cron time, last executed time, status, and next execution time.
   */
  getJobs() {
    return Object.keys(this.tasks).map((name) => {
      const jobDetails = this.getJobByName(name)
      if (jobDetails) {
        const { job, cronTime, lastExecuted } = jobDetails
        let status = 'Not initialized'
        let nextExecution = 'Not initialized'
        if (job) {
          status = job?.running ? 'Running' : 'Stopped'
          try {
            nextExecution = job?.nextDate()?.toISOString()
          } catch (error) {
            this.logger.info(
              `Error getting next execution time for job ${name}: ${error.message}`
            )
          }
        }
        return {
          name,
          cronTime,
          lastExecuted,
          status,
          nextExecution
        }
      }
      return null
    })
  }

  /**
   * Get details of a specific job by name.
   * @param {string} name - The name of the job.
   * @returns {Object|null} - The job details if found, otherwise null.
   */
  getJobByName(name) {
    const job = this.tasks[name]
    if (job) {
      return job
    }
    return null
  }

  /**
   * Manually run a job by name.
   * @param {string} name - The name of the job to run.
   */
  runJobManually(name) {
    const job = this.getJobByName(name)
    if (job) {
      job.job()
      job.lastExecuted = new Date()
    }
  }
}

// Create an instance of JobManager
const jobManager = new JobManager()

// Export the jobManager instance as the default export of this module
export default jobManager
