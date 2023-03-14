import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commission } from '../commission/entities/commission.entity';
import { Sale } from '../sale/entities/sale.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Commission)
    private commissionRepository: Repository<Commission>,
  ) {}

  async save(createProductDto: CreateProductDto) {
    const { name, creator_id } = createProductDto;

    const existingProduct = await this.findByName(name);

    if (existingProduct) {
      return existingProduct;
    }

    const newProduct = this.productRepository.create({
      name,
      creator: { id: creator_id },
    });

    return this.productRepository.save(newProduct);
  }

  findByName(name: string) {
    return this.productRepository.findOne({
      where: { name },
      relations: ['creator'],
    });
  }
  async findAllWithSalesAndCommissions(): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: ['sales', 'commissions'],
    });

    // Fetch all sales and commissions for all products using a single query
    const productIds = products.map((product) => product.id);

    if (!products.length) return [];

    const allSalesAndCommissions = await this.saleRepository
      .createQueryBuilder('sale')
      .innerJoinAndSelect('sale.product', 'product')
      .leftJoinAndSelect('sale.creator', 'creator')
      .leftJoinAndSelect('sale.affiliate', 'affiliate')
      .where('product.id IN (:...productIds)', { productIds })
      .orderBy('sale.date', 'DESC')
      .getMany();

    const allCommissions = await this.commissionRepository
      .createQueryBuilder('commission')
      .innerJoinAndSelect('commission.product', 'product')
      .leftJoinAndSelect('commission.creator', 'creator')
      .leftJoinAndSelect('commission.affiliate', 'affiliate')
      .where('product.id IN (:...productIds)', { productIds })
      .orderBy('commission.date', 'DESC')
      .getMany();

    // Group sales by product ID
    const salesByProductId = allSalesAndCommissions.reduce((acc, sale) => {
      const product_id = sale.product.id;
      if (!acc[product_id]) {
        acc[product_id] = [];
      }
      acc[product_id].push(sale);
      return acc;
    }, {});

    // Group commissions by product ID
    const commissionsByProductId = allCommissions.reduce((acc, commission) => {
      const product_id = commission.product.id;
      if (!acc[product_id]) {
        acc[product_id] = [];
      }
      acc[product_id].push(commission);
      return acc;
    }, {});

    // Assign sales and commissions to products
    products.forEach((product) => {
      product.sales = salesByProductId[product.id] || [];
      product.commissions = commissionsByProductId[product.id] || [];
    });

    return products;
  }
}
