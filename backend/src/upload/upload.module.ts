import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CreatorService } from '../creator/creator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creator } from '../creator/entities/creator.entity';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Creator, Product])],
  controllers: [UploadController],
  providers: [UploadService, CreatorService, ProductService],
})
export class UploadModule {}
