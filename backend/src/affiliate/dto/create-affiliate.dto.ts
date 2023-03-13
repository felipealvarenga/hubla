import { ApiProperty } from '@nestjs/swagger';

export class CreateAffiliateDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  creator_id: number;
}
