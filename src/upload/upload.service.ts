import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  ForbiddenException,
} from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { Bucket } from '@google-cloud/storage';
import { firebaseUpload } from 'src/utils/firebaseupload';
import { DestroyDto } from './dtos/destroy.dto';

@Injectable()
export class UploadService {
  bucket: Bucket;
  constructor(@InjectFirebaseAdmin() firebase: FirebaseAdmin) {
    this.bucket = firebase.storage.bucket();
  }

  async upload(file: Express.Multer.File) {
    if (!file) throw new NotFoundException('No file was found');

    if (file.size > 1024 * 1024)
      throw new PayloadTooLargeException('Size too large ');

    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png')
      throw new UnsupportedMediaTypeException('File format is incorrect');

    const result = await firebaseUpload(file, this.bucket);
    if (!result) throw new InternalServerErrorException('Failed to upload');

    return { ...result };
  }

  async delete(dto: DestroyDto) {
    const { filename } = dto;

    const result = await this.bucket
      .file('Image/' + filename.toString())
      .delete()
      .catch(() => false);

    if (!result)
      throw new InternalServerErrorException('Failed to delete resource');

    return { msg: 'Delete resource successfully' };
  }
}
