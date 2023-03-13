import { Controller, Get, Param } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';

@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get()
  findAll() {
    return this.affiliateService.findAll();
  }
  @Get(':id/balance')
  async getBalance(
    @Param('id') id: string,
  ): Promise<{ id: number; name: string; balance: number }> {
    const [result] = await this.affiliateService.getBalance(+id);
    return result;
  }
}
