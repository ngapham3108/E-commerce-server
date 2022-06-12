import { Bucket } from '@google-cloud/storage';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const firebaseUpload = (file: Express.Multer.File, bucket: Bucket) => {
  return new Promise<any>(async (resolve, reject) => {
    const filename = uuidv4();
    const blob = bucket.file('Image/' + filename);

    const publicUrl = await blob.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    if (!publicUrl) {
      reject(false);
    }

    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobWriter.on('error', () => {
      reject(false);
    });

    blobWriter.on('finish', () => {
      resolve({ publicUrl, filename });
    });

    blobWriter.end(file.buffer);
  });
};
