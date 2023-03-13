import { Controller, Get } from '@nestjs/common';
import { CreatorService } from './creator.service';

@Controller('creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get()
  findAll() {
    return this.creatorService.findAll();
  }
}
