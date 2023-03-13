import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionService } from './commission.service';
import { Commission } from './entities/commission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commission])],
  providers: [CommissionService],
})
export class CommissionModule {}
