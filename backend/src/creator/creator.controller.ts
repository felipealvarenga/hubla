import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreateCreatorDto } from './dto/create-creator.dto';

@Controller('creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get()
  findAll() {
    return this.creatorService.findAll();
  }
}
