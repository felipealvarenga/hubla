import { Controller, Get, Param } from '@nestjs/common';
import { CreatorService } from './creator.service';

@Controller('creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get()
  findAll() {
    return this.creatorService.findAll();
  }
  @Get(':id/balance')
  async getBalance(@Param('id') id: string): Promise<{ balance: number }> {
    return this.creatorService.getBalance(+id);
  }
}
