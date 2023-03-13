import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { Creator } from './entities/creator.entity';
import { Repository } from 'typeorm';
import { Sale } from '../sale/entities/sale.entity';
import { Commission } from '../commission/entities/commission.entity';

@Injectable()
export class CreatorService {
  constructor(
    @InjectRepository(Creator)
    private creatorRepository: Repository<Creator>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Commission)
    private commissionRepository: Repository<Commission>,
  ) {}

  async save(createCreatorDto: CreateCreatorDto) {
    const { name } = createCreatorDto;
    const creator = await this.findByName(name);

    if (!creator) {
      return this.creatorRepository.save(createCreatorDto);
    }

    return creator;
  }

  findAll() {
    return this.creatorRepository.find();
  }

  findByName(name: string) {
    return this.creatorRepository.findOneBy({
      name: name,
    });
  }

  async getBalance(creator_id: number): Promise<{ balance: number }> {
    const [creator] = await this.creatorRepository.find({
      where: { id: creator_id },
    });

    // Get all sales and commissions for the creator
    const sales = await this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.product', 'product')
      .where('product.creator_id = :creator_id', { creator_id })
      .getMany();

    const commissions = await this.commissionRepository
      .createQueryBuilder('commission')
      .leftJoinAndSelect('commission.product', 'product')
      .where('product.creator_id = :creator_id', { creator_id })
      .andWhere('commission.affiliate_id IS NULL') // Get paid commissions only
      .getMany();

    // Calculate the total sum of sales and commissions
    const salesSum = sales.reduce((acc, sale) => acc + sale.amount, 0);
    const commissionsSum = commissions.reduce(
      (acc, commission) => acc + commission.amount,
      0,
    );

    const balance = salesSum + commissionsSum;

    return { ...creator, balance };
  }
}
