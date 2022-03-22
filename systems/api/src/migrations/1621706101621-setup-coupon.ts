import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class setupCoupon1621706101621 implements MigrationInterface {
  name = 'setupCoupon1621706101621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        columns: [
          {
            default: 'uuid_generate_v4()',
            isPrimary: true,
            name: 'id',
            type: 'uuid',
          },
          {
            isNullable: false,
            name: 'active',
            type: 'boolean',
          },
          {
            isNullable: false,
            name: 'product',
            type: 'character varying',
          },
          {
            isNullable: false,
            name: 'code',
            type: 'character varying',
          },
          {
            isNullable: true,
            name: 'description',
            type: 'character varying',
          },
          {
            isNullable: false,
            name: 'start_date',
            type: 'TIMESTAMP',
          },
          {
            isNullable: false,
            name: 'end_date',
            type: 'TIMESTAMP',
          },
          {
            isNullable: false,
            name: 'discount_type',
            type: 'character varying',
          },
          {
            isNullable: true,
            name: 'percent_off',
            type: 'int',
          },
          {
            isNullable: true,
            name: 'amount_off',
            type: 'int',
          },
          {
            default: "'{}'",
            name: 'metadata',
            type: 'json',
          },
          {
            default: 'NOW()',
            isNullable: false,
            name: 'updated_at',
            type: 'TIMESTAMP',
          },
          {
            default: 'NOW()',
            isNullable: false,
            name: 'created_at',
            type: 'TIMESTAMP',
          },
        ],
        name: 'coupon',
      }),
    );
    await queryRunner.createUniqueConstraint(
      'coupon',
      new TableUnique({
        columnNames: ['code'],
        name: 'coupon-code-unique',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('coupon', 'coupon-code-unique');
    await queryRunner.dropTable(new Table({ name: 'coupon' }));
  }
}
