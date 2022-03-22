import typeorm from 'typeorm';

import { DiscountType } from '../constants/discount-type.constants';
import { Coupon } from './coupon.entity';

const { ChildEntity, Column } = typeorm;

@ChildEntity(DiscountType.Amount)
export class AmountDiscountCoupon extends Coupon {
  @Column()
  amountOff!: number;
}

export function assertAmountDiscountCoupon(
  coupon: Partial<Coupon>,
): coupon is AmountDiscountCoupon {
  return coupon.discountType === DiscountType.Amount;
}
