import { injectable } from 'inversify';
import fs from 'fs';
import AWS, { S3 } from 'aws-sdk';
import { File, FileUploaderService, UploadedFileResponse } from '../../application/services/FileUploaderService';
import config from '../../infrastructure/config';

AWS.config.update({
  accessKeyId: config.get('aws.accessKeyId'),
  secretAccessKey: config.get('aws.secretAccessKey'),
});

@injectable()
export class AWSFileUploader implements FileUploaderService {
  private client: S3;

  private readonly bucketName = config.get('aws.s3.bucketName');

  constructor() {
    this.client = new AWS.S3({ region: config.get('aws.s3.defaultRegion') });
  }

  private async uploadFile(file: any): Promise<UploadedFileResponse> {
    const bodyFile = fs.createReadStream(file.path);
    const result = await this.client
      .upload({
        Bucket: this.bucketName,
        Key: file.path,
        Body: bodyFile,
        ContentType: file.mimetype,
        ACL: config.get('aws.s3.defaultFilesACL'),
      })
      .promise();

    return {
      path: result.Location,
      filename: file.originalname,
    };
  }

  async upload(files: File[]): Promise<UploadedFileResponse[] | undefined> {
    try {
      return await Promise.all(files.map((file) => this.uploadFile(file)));
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
}
