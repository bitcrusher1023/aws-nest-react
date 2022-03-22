import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import type { DiscountType } from '../constants/discount-type.constants';
import { AmountDiscountCoupon } from '../entities/amount-discount-coupon.entity';
import {
  assertAmountDiscountCoupon,
  assertEffectAmountDiscountCoupon,
  assertEffectPercentDiscountCoupon,
  assertPercentDiscountCoupon,
} from '../entities/assert-coupon';
import { Coupon } from '../entities/coupon.entity';
import { EffectAmountDiscountCoupon } from '../entities/effect-amount-discount-coupon.entity';
import { EffectPercentDiscountCoupon } from '../entities/effect-percent-discount-coupon.entity';
import { PercentDiscountCoupon } from '../entities/percent-discount-coupon.entity';
import { UnknownDiscountTypeException } from '../exceptions/UnknownDiscountTypeException';

export class CouponRepositoryFactory {
  constructor(
    @InjectRepository(AmountDiscountCoupon)
    private amountCouponRepository: Repository<AmountDiscountCoupon>,
    @InjectRepository(PercentDiscountCoupon)
    private percentCouponRepository: Repository<PercentDiscountCoupon>,
    @InjectRepository(EffectAmountDiscountCoupon)
    private effectAmountCouponRepository: Repository<EffectAmountDiscountCoupon>,
    @InjectRepository(EffectPercentDiscountCoupon)
    private effectPercentCouponRepository: Repository<EffectPercentDiscountCoupon>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  getRepository({
    discountType,
  }: {
    discountType?: DiscountType;
  } = {}): Repository<
    | Coupon
    | AmountDiscountCoupon
    | PercentDiscountCoupon
    | EffectAmountDiscountCoupon
    | EffectPercentDiscountCoupon
  > {
    if (!discountType) {
      return this.couponRepository;
    }
    if (assertPercentDiscountCoupon({ discountType }))
      return this.percentCouponRepository;
    if (assertAmountDiscountCoupon({ discountType }))
      return this.amountCouponRepository;
    if (assertEffectPercentDiscountCoupon({ discountType }))
      return this.effectPercentCouponRepository;
    if (assertEffectAmountDiscountCoupon({ discountType }))
      return this.effectAmountCouponRepository;
    throw new UnknownDiscountTypeException({
      errors: [`Unknown discount type: ${discountType}`],
    });
  }
}
