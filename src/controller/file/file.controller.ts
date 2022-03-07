import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

@Controller('/file')
export class FileController {
  @Post('/')
  @UseInterceptors(fileInterceptor())
  public uploadFile() {
    return;
  }
}

function fileInterceptor() {
  return FileInterceptor('file', {
    storage: multerS3({
      s3: new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_KEY_SECRET,
      }),
      bucket: process.env.AWS_S3_BUCKET,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        cb(null, `${file.originalname}_${Date.now()}`);
      }
    })
  });
}
