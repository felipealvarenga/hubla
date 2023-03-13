import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreatorService } from './creator.service';

@Controller('creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get()
  @ApiOperation({ summary: 'Get all creators' })
  @ApiResponse({
    status: 200,
    description: 'Return all creators.',
  })
  @Get()
  findAll() {
    return this.creatorService.findAll();
  }
  @Get(':id/balance')
  @ApiOperation({ summary: 'Get creator balance by ID' })
  @ApiParam({ name: 'id', description: 'Creator ID' })
  @ApiResponse({
    status: 200,
    description: 'Return creator balance by ID.',
  })
  async getBalance(@Param('id') id: string) {
    return this.creatorService.getBalance(+id);
  }
}
