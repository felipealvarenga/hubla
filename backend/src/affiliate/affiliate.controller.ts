import { Controller, Get } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';

@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get()
  findAll() {
    return this.affiliateService.findAll();
  }
}
