import { DiscountType } from '@api/modules/coupon/constants/discount-type.constants';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class couponDiscountTypeType1625586119197 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'coupon',
      'discount_type',
      new TableColumn({
        enum: [DiscountType.Amount, DiscountType.Percent],
        name: 'discount_type',
        type: 'enum',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'coupon',
      'discount_type',
      new TableColumn({
        name: 'discount_type',
        type: 'character varying',
      }),
    );
  }
}
