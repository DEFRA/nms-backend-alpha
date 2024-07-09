import jobManager from './job-manager'
import { createLogger } from '../logging/logger'
import { fetchSubmissions } from '../../jobs/fetch-submission'

const logger = createLogger()

const scheduledJobs = () => {
  jobManager.scheduleJob(
    'fetch-submission',
    '59 23 * * *',
    async () => {
      logger.info('Running the fetch submission job')
      await fetchSubmissions()
    },
    {
      scheduled: true,
      timezone: 'Europe/London'
    }
  )
}

export default scheduledJobs
