import typeorm from 'typeorm';

import { DiscountType } from '../constants/discount-type.constants';
import { Coupon } from './coupon.entity';

const { ChildEntity, Column } = typeorm;

@ChildEntity(DiscountType.EffectPercent)
export class EffectPercentDiscountCoupon extends Coupon {
  @Column()
  percentOff!: number;

  @Column()
  effect!: string;
}

export function assertEffectPercentDiscountCoupon(
  coupon: Partial<Coupon>,
): coupon is EffectPercentDiscountCoupon {
  return coupon.discountType === DiscountType.EffectPercent;
}
