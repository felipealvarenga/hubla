import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { Affiliate } from './entities/affiliate.entity';

@Injectable()
export class AffiliateService {
  constructor(
    @InjectRepository(Affiliate)
    private affiliateRepository: Repository<Affiliate>,
  ) {}

  async save(createAffiliateDto: CreateAffiliateDto) {
    const { name, creator_id } = createAffiliateDto;

    const existingAffiliate = await this.findByName(name);

    if (existingAffiliate) {
      return existingAffiliate;
    }

    const affiliate = this.affiliateRepository.create({
      name,
      creator: { id: creator_id },
    });

    return this.affiliateRepository.save(affiliate);
  }

  findByName(name: string) {
    return this.affiliateRepository.findOneBy({
      name: name,
    });
  }
  async findAll() {
    const affiliates = await this.affiliateRepository.find();
    return affiliates.map((affiliate) => ({
      id: affiliate.id,
      name: affiliate.name,
    }));
  }
  async getBalance(id: number) {
    const affiliates = await this.affiliateRepository.find({
      where: { id },
      relations: { commissions: true },
    });
    return affiliates.map((affiliate) => ({
      id: affiliate.id,
      name: affiliate.name,
      balance: affiliate.commissions.reduce(
        (acc, commission) => acc + commission.amount,
        0,
      ),
    }));
  }
}
