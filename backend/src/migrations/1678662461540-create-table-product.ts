import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableProduct1678662461540 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        create table product (
          id bigserial primary key,
          creator_id bigint not null references creator(id),
          name varchar(255) not null
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table product`);
  }
}
