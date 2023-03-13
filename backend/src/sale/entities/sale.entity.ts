import { Creator } from '../../creator/entities/creator.entity';
import { Product } from '../../product/entities/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Affiliate } from 'src/affiliate/entities/affiliate.entity';

@Entity('sale')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Creator, { nullable: true })
  @JoinColumn({ name: 'creator_id' })
  creator: Creator;

  @ManyToOne(() => Affiliate, { nullable: true })
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @Column()
  date: Date;

  @Column()
  amount: number;
}
