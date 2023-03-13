import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CreatorService } from '../creator/creator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creator } from '../creator/entities/creator.entity';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { Sale } from '../sale/entities/sale.entity';
import { SaleService } from 'src/sale/sale.service';

@Module({
  imports: [TypeOrmModule.forFeature([Creator, Product, Sale])],
  controllers: [UploadController],
  providers: [UploadService, CreatorService, ProductService, SaleService],
})
export class UploadModule {}
