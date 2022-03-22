import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminCouponController } from './admin-coupon.controller';
import { AmountDiscountCoupon } from './entities/amount-discount-coupon.entity';
import { Coupon } from './entities/coupon.entity';
import { EffectAmountDiscountCoupon } from './entities/effect-amount-discount-coupon.entity';
import { EffectPercentDiscountCoupon } from './entities/effect-percent-discount-coupon.entity';
import { PercentDiscountCoupon } from './entities/percent-discount-coupon.entity';
import { PublicCouponController } from './public-coupon.controller';
import { CouponRepositoryFactory } from './services/coupon-repository.factory';
import { FindCouponService } from './services/find-coupon.service';
import { ManipulateCouponService } from './services/manipulate-coupon.service';
import { TrackingService } from './services/tracking.service';
import { VerifyCouponService } from './services/verify-coupon.service';

@Module({
  controllers: [AdminCouponController, PublicCouponController],
  exports: [VerifyCouponService, FindCouponService],
  imports: [
    TypeOrmModule.forFeature([
      Coupon,
      AmountDiscountCoupon,
      PercentDiscountCoupon,
      EffectAmountDiscountCoupon,
      EffectPercentDiscountCoupon,
    ]),
    ConfigModule,
  ],
  providers: [
    CouponRepositoryFactory,
    ManipulateCouponService,
    FindCouponService,
    VerifyCouponService,
    TrackingService,
  ],
})
export class CouponModule {}
