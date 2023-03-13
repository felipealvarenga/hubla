import { Creator } from '../../creator/entities/creator.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('affiliate')
export class Affiliate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Creator, (creator) => creator.products)
  @JoinColumn({ name: 'creator_id' })
  creator: Creator;
}
