// import { GetObjectCommand } from '@aws-sdk/client-s3'
import { ObjectId } from 'mongodb'

// import { config } from '~/src/config/index.js'
import { mongoCollections } from '~/src/helpers/constants'
import { readDocument } from '~/src/helpers/database-transaction'
// import { s3Client } from '~/src/helpers/s3-client.js'
// import { uploadToSharePoint } from '~/src/services/powerapps/dataverse'
// import { streamToBuffer } from '../helpers/stream-to-buffer'

// import { createLogger } from '~/src/helpers/logging/logger'

const indexController = {
  handler: async (request, h) => {
    request.logger.info('Reading Document from MongoDB')
    const { id, collection } = request.params
    try {
      const document = await readDocument(
        request.db,
        mongoCollections[collection],
        {
          _id: new ObjectId(id)
        }
      )
      request.logger.info('ReadDocument successful')
      if (document) {
        request.logger.info('Document has been read from MongoDB')
        return h.response('Successful').code(200)
        /* if (document?.file) {
          const { fileUrl: s3Key, filename } = document?.file
          const command = new GetObjectCommand({
            Bucket: config.get('bucket'),
            Key: s3Key
          })

          const response = await s3Client.send(command)
          const fileBuffer = await streamToBuffer(response.Body)
          const folderUrl =
            '/sites/NutrientNeutralityprojectdelivery/Credit Sales/Avon/NM-D-Av-0008/Applications'
          const uploadUrl = `https://defradev.sharepoint.com${folderUrl}/_api/web/getfolderbyserverrelativeurl('${folderUrl}')/files/add(overwrite=true, url='${filename}')`
          request.logger.info('uploadUrl >> ' + uploadUrl)
          const uploadResponse = await uploadToSharePoint(uploadUrl, fileBuffer)
          // .header('Content-Type', response.ContentType)
          return h.response(uploadResponse).code(200)
        } else {
          return h
            .response({ document, error: 'Document does not have file' })
            .code(404)
        } */
      } else {
        return h.response({ error: 'Document not found' }).code(404)
      }
    } catch (err) {
      request.logger.error(err)
      return h.response('File Not Found').code(404)
    }
  }
}

export { indexController }
