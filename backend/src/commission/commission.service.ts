import { Injectable } from '@nestjs/common';
import { CreateCommissionDto } from './dto/create-commission.dto';

@Injectable()
export class CommissionService {
  create(createCommissionDto: CreateCommissionDto) {
    return 'This action adds a new commission';
  }
}
