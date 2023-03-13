import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';

@Controller('affiliate')
@ApiTags('Affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get()
  @ApiOperation({ summary: 'Get all affiliates' })
  @ApiResponse({
    status: 200,
    description: 'Return all affiliates.',
  })
  findAll() {
    return this.affiliateService.findAll();
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Get affiliate balance by ID' })
  @ApiParam({ name: 'id', description: 'Affiliate ID' })
  @ApiResponse({
    status: 200,
    description: 'Return affiliate balance by ID.',
  })
  async getBalance(@Param('id') id: string) {
    const [result] = await this.affiliateService.getBalance(+id);
    return result;
  }
}
