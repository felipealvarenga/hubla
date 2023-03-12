import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Res() res, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Error on file uploaded', HttpStatus.BAD_REQUEST);
    }

    return res.send(file);
  }
}
