import typeorm from 'typeorm';

import { DiscountType } from '../constants/discount-type.constants';
import { Coupon } from './coupon.entity';

const { ChildEntity, Column } = typeorm;

@ChildEntity(DiscountType.Percent)
export class PercentDiscountCoupon extends Coupon {
  @Column()
  percentOff!: number;
}

export function assertPercentDiscountCoupon(
  coupon: Partial<Coupon>,
): coupon is PercentDiscountCoupon {
  return coupon.discountType === DiscountType.Percent;
}
