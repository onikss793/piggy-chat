import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

@Controller('/file')
export class FileController {
  @Post('/')
  @UseInterceptors(fileInterceptor())
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      name: file.originalname,
      url: file['location']
    };
  }
}

function fileInterceptor() {
  return FileInterceptor('file', {
    storage: multerS3({
      s3: new AWS.S3(),
      bucket: process.env.AWS_S3_BUCKET,
      acl: 'public-read',
      key: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
      }
    })
  });
}
