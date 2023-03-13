import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('creator')
export class Creator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
