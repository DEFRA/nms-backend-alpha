// import { GetObjectCommand } from '@aws-sdk/client-s3'
import { ObjectId } from 'mongodb'

// import { config } from '~/src/config/index.js'
import { mongoCollections } from '~/src/helpers/constants'
import { readDocument } from '~/src/helpers/database-transaction'
// import { s3Client } from '~/src/helpers/s3-client.js'
// import { uploadToSharePoint } from '~/src/services/powerapps/dataverse'
// import { streamToBuffer } from '../helpers/stream-to-buffer'
import { callLogicApp } from '~/src/services/powerapps/dataverse'

/* const indexController = {
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
        if (document?.file) {
          const { fileUrl: s3Key, filename } = document?.file
          const command = new GetObjectCommand({
            Bucket: config.get('bucket'),
            Key: s3Key
          })

          const response = await s3Client.send(command)
          const fileBuffer = await streamToBuffer(response.Body)
          request.logger.info('fileBuffer >>>    ' + fileBuffer)
          const folderUrl =
            '/sites/NutrientNeutralityprojectdelivery/Credit Sales/Avon/NM-D-Av-0008/Applications'
          const uploadUrl = `https://defradev.sharepoint.com${folderUrl}/_api/web/getfolderbyserverrelativeurl('${folderUrl}')/files/add(overwrite=true, url='${filename}')`
          const logicAppUrl = 'https://devnmswebaf1401.azurewebsites.net:443/api/testworkflow1/triggers/When_a_HTTP_request_is_received/invoke?api-version=2022-05-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=trstytkwONJ7yjp7Dd4ABqxKQmBdwbRDRX2iYtuHeM0'
          request.logger.info('logicAppUrl >> ' + logicAppUrl)
          // return h.response('Successful without Uploading to SP').code(200)
          const logicAppResponse = await callLogicApp(logicAppUrl)
          request.logger.info('logicAppResponse >> ' + logicAppResponse)
          const uploadResponse = await uploadToSharePoint(uploadUrl, fileBuffer)
          request.logger.info('uploadResponse >> ' + uploadResponse)
          // .header('Content-Type', response.ContentType)
          return h.response(logicAppResponse).code(200)
        } else {
          return h
            .response({ document, error: 'Document does not have file' })
            .code(404)
        }
      } else {
        return h.response({ error: 'Document not found' }).code(404)
      }
    } catch (err) {
      request.logger.error(err)
      return h.response('File Not Found').code(404)
    }
  }
} */

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
        if (document?.file) {
          const logicAppUrl =
            'https://devnmswebaf1401.azurewebsites.net:443/api/testworkflow1/triggers/When_a_HTTP_request_is_received/invoke?api-version=2022-05-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=trstytkwONJ7yjp7Dd4ABqxKQmBdwbRDRX2iYtuHeM0'
          request.logger.info(`Before invoking logicAppUrl `)
          // return h.response('Successful without Uploading to SP').code(200)
          const logicAppResponse = await callLogicApp(logicAppUrl)
          request.logger.info('logicAppResponse >> ' + logicAppResponse)
          // .header('Content-Type', response.ContentType)
          return h.response('Logic App invoked !!!').code(200)
        } else {
          return h
            .response({ document, error: 'MongoDB does not have file' })
            .code(404)
        }
      } else {
        return h.response({ error: 'Document not found in Mongo' }).code(404)
      }
    } catch (err) {
      request.logger.error(err)
      return h.response('LogicApp Error').code(404)
    }
  }
}

export { indexController }
