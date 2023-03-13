import { Module } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creator } from './entities/creator.entity';
import { Sale } from '../sale/entities/sale.entity';
import { Commission } from '../commission/entities/commission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Creator, Sale, Commission])],
  controllers: [CreatorController],
  providers: [CreatorService],
})
export class CreatorModule {}
