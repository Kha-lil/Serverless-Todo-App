import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'


const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const logger = createLogger('AttachmentUtils')


const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
export class AttachmentUtils {

  constructor(
    //private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    //private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {
  }

  async getUploadUrl(todoId: string) {
    console.log(`generating upload url for todoId:${todoId}`)
    logger.info(`generating upload url for todoId:${todoId}`)
    const url = await s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: 3000
    })
    return url
  }


}
