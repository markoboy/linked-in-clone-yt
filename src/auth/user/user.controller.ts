import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UpdateResult } from 'typeorm';
import { JwtGuard } from '../guards/jwt.guard';
import { AuthRequest } from '../models/auth-request.interface';
import { MulterConfigService } from '../multer-config/multer-config.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private multerConfigService: MulterConfigService,
  ) {}

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthRequest,
  ): Observable<UpdateResult> {
    return from(this.multerConfigService.isValidFile(file)).pipe(
      switchMap((isValid) => {
        if (isValid) {
          const userId = req.user.id;
          const fileName = file.filename;

          return this.userService.updateUserImageById(userId, fileName);
        }
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image')
  findImage(
    @Req() req: AuthRequest,
    @Res() res: Response,
  ): Observable<unknown> {
    const userId = req.user.id;

    return this.userService.findImagePathByUserId(userId).pipe(
      switchMap<string, Observable<string>>(
        this.multerConfigService.getFullPath,
      ),
      switchMap((fullPath) => of(res.sendFile(fullPath))),
    );
  }
}
