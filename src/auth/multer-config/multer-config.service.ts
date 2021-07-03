import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as FileType from 'file-type';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { from, Observable } from 'rxjs';
import { IEnvConfig, IEnvMulter } from 'src/configs/env.config';
import { v4 as uuidV4 } from 'uuid';

type ValidFileExtension = 'png' | 'jpg' | 'jpeg';

type ValidMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: ValidFileExtension[] = ['png', 'jpg', 'jpeg'];

const validMimeTypes: ValidMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

const INVALID_FILE_TYPE = 'File type must be a png, jpg or jpeg!';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  public static UPLOAD_DESTINATION: string;

  constructor(private configService: ConfigService<IEnvConfig>) {
    MulterConfigService.UPLOAD_DESTINATION =
      configService.get<IEnvMulter>('multer').imagePath;

    this.getFullPath = this.getFullPath.bind(this);
  }

  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    return {
      storage: diskStorage({
        destination: MulterConfigService.UPLOAD_DESTINATION,
        filename: (req, file, cb) => {
          const fileExtension: string = path.extname(file.originalname);
          const fileName: string = Date.now() + '-' + uuidV4() + fileExtension;

          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const mimeTypeError = validMimeTypes.includes(
          file.mimetype as ValidMimeType,
        )
          ? null
          : new BadRequestException(INVALID_FILE_TYPE);

        cb(mimeTypeError, !mimeTypeError);
      },
    };
  }

  async isValidFile(file: Express.Multer.File): Promise<boolean> {
    const fullPath = path.resolve(
      MulterConfigService.UPLOAD_DESTINATION,
      file.filename,
    );

    const { ext, mime } = (await FileType.fromFile(fullPath)) || {};

    const isValidFileExtension = validFileExtensions.includes(
      ext as ValidFileExtension,
    );
    const isValidMimeType = validMimeTypes.includes(mime as ValidMimeType);

    if (!isValidFileExtension || !isValidMimeType) {
      try {
        fs.unlinkSync(fullPath);
      } catch (error) {
        console.error(error);
      }
      throw new BadRequestException(INVALID_FILE_TYPE);
    }

    return true;
  }

  getFullPath(fileName?: string): Observable<string> {
    return from(
      new Promise<string>((resolve, reject) => {
        if (!fileName) {
          reject(new NotFoundException());
        }

        const fullPath = path.resolve(
          MulterConfigService.UPLOAD_DESTINATION,
          fileName,
        );

        fs.access(fullPath, (err) => {
          if (err) {
            reject(new NotFoundException());
            return;
          }

          resolve(fullPath);
        });
      }),
    );
  }
}
