import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableCreator1678315878659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    create table creator (
      id bigserial primary key,
      name varchar(255) not null
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table creator`);
  }
}
