import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Row } from './row';

@Injectable()
export class UploadService {
  async parseAndSave(file: Express.Multer.File) {
    const rows = file.buffer.toString().split('\n').filter(Boolean);
    const fieldInfo: Array<[number, number, string]> = [
      [0, 1, 'type'],
      [1, 26, 'date'],
      [26, 56, 'product'],
      [56, 66, 'amount'],
      [66, 86, 'seller'],
    ];
    const errors = [];

    for (const [index, rowString] of rows.entries()) {
      const row = Row.parse(rowString, fieldInfo);
      if (row.errors.length > 0) {
        errors.push({ message: row.errors.join(', '), row: index + 1 });
      }
    }

    if (errors.length > 0) {
      const message = errors
        .map((error) => `${error.message} + row: ${error.row}`)
        .join(', ');

      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    return file;
  }
}
