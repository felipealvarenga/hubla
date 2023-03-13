import { Affiliate } from '../../affiliate/entities/affiliate.entity';
import { Creator } from '../../creator/entities/creator.entity';
import { Product } from '../../product/entities/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('commission')
export class Commission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  date: Date;

  @ManyToOne(() => Affiliate, (affiliate) => affiliate.commissions, {
    nullable: false,
  })
  @JoinColumn({ name: 'affiliate_id' })
  affiliate?: Affiliate;

  @ManyToOne(() => Creator, { nullable: false })
  @JoinColumn({ name: 'creator_id' })
  creator: Creator;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
