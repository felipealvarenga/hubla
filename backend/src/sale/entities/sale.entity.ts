import { Creator } from '../../creator/entities/creator.entity';
import { Product } from '../../product/entities/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

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

  affiliate: { id: number };

  @Column()
  date: Date;

  @Column()
  amount: number;
}
