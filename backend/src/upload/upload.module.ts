import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CreatorService } from '../creator/creator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creator } from 'src/creator/entities/creator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Creator])],
  controllers: [UploadController],
  providers: [UploadService, CreatorService],
})
export class UploadModule {}
