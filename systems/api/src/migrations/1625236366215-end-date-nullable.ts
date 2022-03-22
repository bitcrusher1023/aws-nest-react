import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class endDateNullable1625236366215 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'coupon',
      'end_date',
      new TableColumn({
        isNullable: true,
        name: 'end_date',
        type: 'TIMESTAMP',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'coupon',
      'end_date',
      new TableColumn({
        isNullable: false,
        name: 'end_date',
        type: 'TIMESTAMP',
      }),
    );
  }
}
