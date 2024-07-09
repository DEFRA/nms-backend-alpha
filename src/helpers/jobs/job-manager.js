import cron from 'node-cron'
import { createLogger } from '../logging/logger'

class JobManager {
  constructor() {
    this.tasks = {}
    this.logger = createLogger()
  }

  scheduleJob(name, cronTime, jobFunction, options) {
    const job = cron.schedule(cronTime, jobFunction, options)
    this.tasks[name] = { job, cronTime, lastExecuted: null }
    return job
  }

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

  getJobByName(name) {
    const job = this.tasks[name]
    if (job) {
      return job
    }
    return null
  }

  runJobManually(name) {
    const job = this.getJobByName(name)
    if (job) {
      job.job()
      job.lastExecuted = new Date()
    }
  }
}
const jobManager = new JobManager()

export default jobManager
