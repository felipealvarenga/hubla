import { Commission } from '../../commission/entities/commission.entity';
import { Creator } from '../../creator/entities/creator.entity';
import { Sale } from '../../sale/entities/sale.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Creator)
  @JoinColumn({ name: 'creator_id' })
  creator: Creator;

  @OneToMany(() => Sale, (sale) => sale.product)
  sales?: Sale[];

  @OneToMany(() => Commission, (commission) => commission.product)
  commissions?: Commission[];
}
