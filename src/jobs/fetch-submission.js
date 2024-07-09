import { createLogger } from '../helpers/logging/logger'
import jobManager from '../helpers/jobs/job-manager'

const logger = createLogger()

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

export { fetchSubmissions }
