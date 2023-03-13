import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const { date, amount, product_id, affiliate_id, creator_id } =
      createSaleDto;

    const sale = this.saleRepository.create({
      date,
      amount,
      product: { id: product_id },
      creator: { id: creator_id },
      affiliate: affiliate_id ? { id: affiliate_id } : undefined,
    });

    return this.saleRepository.save(sale);
  }
}
