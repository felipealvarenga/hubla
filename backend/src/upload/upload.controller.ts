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
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('Upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file of product transactions' })
  @ApiBadRequestResponse({
    description: 'There is an error in the uploaded file',
  })
  @ApiResponse({
    status: 200,
    description: 'Upload transactions file',
  })
  async uploadFile(@Res() res, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        'There is an error in the uploaded file',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.uploadService.parseAndSave(file);
    return res.send(file);
  }
}
