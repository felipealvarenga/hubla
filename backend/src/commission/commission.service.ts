import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { Commission } from './entities/commission.entity';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(Commission)
    private commissionRepository: Repository<Commission>,
  ) {}
  async create(createCommissionDto: CreateCommissionDto) {
    const { amount, date, product_id, affiliate_id, creator_id } =
      createCommissionDto;

    const commission = this.commissionRepository.create({
      amount,
      date,
      product: { id: product_id },
      creator: { id: creator_id },
      affiliate: affiliate_id ? { id: affiliate_id } : undefined,
    });

    return this.commissionRepository.save(commission);
  }
}
