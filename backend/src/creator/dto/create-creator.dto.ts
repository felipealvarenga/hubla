import { ApiProperty } from '@nestjs/swagger';

export class CreateCreatorDto {
  @ApiProperty()
  name: string;
}
