import { Creator } from '../../creator/entities/creator.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Commission } from '../../commission/entities/commission.entity';

@Entity('affiliate')
export class Affiliate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Creator, (creator) => creator.products)
  @JoinColumn({ name: 'creator_id' })
  creator: Creator;

  @OneToMany(() => Commission, (commission) => commission.affiliate)
  commissions: Commission[];
}
