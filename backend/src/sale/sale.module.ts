import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleService } from './sale.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale])],
  providers: [SaleService],
})
export class SaleModule {}
