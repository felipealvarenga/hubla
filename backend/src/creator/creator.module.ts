import { Module } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creator } from './entities/creator.entity';
import { Sale } from 'src/sale/entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Creator, Sale])],
  controllers: [CreatorController],
  providers: [CreatorService],
})
export class CreatorModule {}
