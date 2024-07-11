import { GetObjectCommand } from '@aws-sdk/client-s3'

import { config } from '~/src/config/index.js'
import { s3Client } from '~/src/helpers/s3-client.js'

const indexController = {
  handler: async (request, h) => {
    const s3Key =
      'submission/48bd74da-c0a9-4421-b98a-3dbd12392b58/bd5fc82b-4746-4da3-a87f-b4d10a2636a4'
    const command = new GetObjectCommand({
      Bucket: config.get('bucket'),
      Key: s3Key
    })

    try {
      const response = await s3Client.send(command)
      return h
        .response(response.Body)
        .header('Content-Type', response.ContentType)
        .code(200)
    } catch (err) {
      request.logger.error(err)
      return h.response('File Not Found').code(404)
    }
  }
}

export { indexController }
