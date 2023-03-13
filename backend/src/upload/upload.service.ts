import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { CreatorService } from '../creator/creator.service';
import { Row } from './row';
import { SaleService } from '../sale/sale.service';
import { AffiliateService } from '../affiliate/affiliate.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly creatorService: CreatorService,
    private readonly productService: ProductService,
    private readonly saleService: SaleService,
    private readonly affiliateService: AffiliateService,
  ) {}
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
      } else if (row.type === '1') {
        await this.handleCreatorSale(row);
      } else if (row.type === '2') {
        await this.handleAffiliateSale(row);
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
  private async handleCreatorSale(row: Row) {
    const creator = await this.creatorService.save({ name: row.seller });
    const product = await this.productService.save({
      name: row.product,
      creator_id: creator.id,
    });
    await this.saleService.create({
      date: row.date,
      amount: row.amount,
      product_id: product.id,
      creator_id: creator.id,
    });
  }

  private async handleAffiliateSale(row: Row) {
    const existingProduct = await this.productService.findByName(row.product);

    if (!existingProduct) {
      throw new HttpException(
        `Product ${row.product} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const affiliate = await this.affiliateService.save({
      name: row.seller,
      creator_id: existingProduct.creator.id,
    });

    await this.saleService.create({
      date: row.date,
      amount: row.amount,
      product_id: existingProduct.id,
      creator_id: existingProduct.creator.id,
      affiliate_id: affiliate.id,
    });
  }
}
