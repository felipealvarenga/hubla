import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
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
}
