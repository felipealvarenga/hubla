import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/transactions')
  @ApiOperation({ summary: 'Get all products transactions' })
  @ApiResponse({
    status: 200,
    description: 'Return all products transactions.',
  })
  @Get('/transactions')
  getAllProductsTransactions() {
    return this.productService.findAllWithSalesAndCommissions();
  }
}
