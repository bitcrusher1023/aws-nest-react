import { DiscountType } from '@api/modules/coupon/constants/discount-type.constants';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnForEffectCoupon1625996163236
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'coupon',
      'discount_type',
      new TableColumn({
        enum: [
          DiscountType.Amount,
          DiscountType.Percent,
          DiscountType.EffectPercent,
          DiscountType.EffectAmount,
        ],
        name: 'discount_type',
        type: 'enum',
      }),
    );
    await queryRunner.addColumn(
      'coupon',
      new TableColumn({
        isNullable: true,
        name: 'effect',
        type: 'character varying',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'coupon',
      'discount_type',
      new TableColumn({
        enum: [DiscountType.Amount, DiscountType.Percent],
        name: 'discount_type',
        type: 'enum',
      }),
    );
    await queryRunner.dropColumn('coupon', 'effect');
  }
}
