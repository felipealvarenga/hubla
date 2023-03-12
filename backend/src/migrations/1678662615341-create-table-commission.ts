import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableCommission1678662615341 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        create table commission (
          id bigserial primary key,
          product_id bigint not null references product(id),
          creator_id bigint not null references creator(id),
          affiliate_id bigint null references affiliate(id),
          date timestamp not null,
          amount integer not null
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table commission`);
  }
}
