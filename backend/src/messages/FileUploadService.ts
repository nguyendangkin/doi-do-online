import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';

@Injectable()
export class FileUploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads/images');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileName = `${uuidv4()}${extname(file.originalname)}`;
      const filePath = join(this.uploadDir, fileName);

      await sharp(file.buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(filePath);

      uploadedUrls.push(`/uploads/images/${fileName}`);
    }

    return uploadedUrls;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const fileName = imageUrl.split('/').pop();
    const filePath = join(this.uploadDir, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
