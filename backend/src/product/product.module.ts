import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Commission } from '../commission/entities/commission.entity';
import { Sale } from '../sale/entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Sale, Commission])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
