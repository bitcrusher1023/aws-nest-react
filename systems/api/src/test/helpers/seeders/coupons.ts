import { DiscountType } from '@api/modules/coupon/constants/discount-type.constants';
import type { CreateCouponBodyDto } from '@api/modules/coupon/dto/requests/create-coupon.dto';
import {
  assertAmountDiscountCoupon,
  assertEffectAmountDiscountCoupon,
  assertEffectPercentDiscountCoupon,
  assertPercentDiscountCoupon,
} from '@api/modules/coupon/entities/assert-coupon';
import type { Coupon } from '@api/modules/coupon/entities/coupon.entity';
import { CouponRepositoryFactory } from '@api/modules/coupon/services/coupon-repository.factory';
import type { TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';

export async function createCouponInDB(
  testingModule: TestingModule,
  coupons: Partial<Coupon>[],
): Promise<Coupon[]> {
  const repositoryFactory = testingModule.get<CouponRepositoryFactory>(
    CouponRepositoryFactory,
  );

  const createdCoupons = (
    await Promise.all(
      Object.entries({
        [DiscountType.Percent]: coupons.filter(coupon =>
          assertPercentDiscountCoupon(coupon),
        ),
        [DiscountType.Amount]: coupons.filter(coupon =>
          assertAmountDiscountCoupon(coupon),
        ),
        [DiscountType.EffectPercent]: coupons.filter(coupon =>
          assertEffectPercentDiscountCoupon(coupon),
        ),
        [DiscountType.EffectAmount]: coupons.filter(coupon =>
          assertEffectAmountDiscountCoupon(coupon),
        ),
      }).map(([discountType, records]) => {
        // @ts-expect-error discountType is string
        return repositoryFactory.getRepository({ discountType }).save(records);
      }),
    )
  ).flat();
  if (createdCoupons.length === 0) throw new Error('Create coupon failed!');
  return createdCoupons;
}

export function couponBuilder(override?: Partial<CreateCouponBodyDto>): any {
  const now = DateTime.now();
  const result = {
    metadata: {},
    product: 'fake-product-id',
    startDate: now.startOf('month').toJSDate().toISOString(),
    ...override,
  };
  return result;
}
