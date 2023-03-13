import { Affiliate } from '../../affiliate/entities/affiliate.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('creator')
export class Creator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Product, (product) => product.creator)
  products: Product[];

  @OneToMany(() => Affiliate, (affiliate) => affiliate.creator)
  affiliates: Affiliate[];
}
