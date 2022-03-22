import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import typeorm from 'typeorm';
import { v4 } from 'uuid';

import type {
  ClientVerifyCouponBodyDto,
  VerifyCouponBodyDto,
  VerifyCouponParamsDto,
  VerifyingOrderRequest,
} from '../dto/requests/verify-coupon.dto';
import {
  assertAmountDiscountCoupon,
  assertPercentDiscountCoupon,
} from '../entities/assert-coupon';
import { Coupon } from '../entities/coupon.entity';
import { InConsistentTrackingIdException } from '../exceptions/InConsistentTrackingIdException';
import { UnknownCouponCodeException } from '../exceptions/UnknownCouponCodeException';
import { TrackingService } from './tracking.service';

const { Brackets } = typeorm;

export class VerifyCouponService {
  constructor(
    @InjectRepository(Coupon) private couponRepository: Repository<Coupon>,
    private trackingService: TrackingService,
  ) {}

  async clientVerifyCoupon(
    payload: ClientVerifyCouponBodyDto & VerifyCouponParamsDto,
  ) {
    const products = payload.order.items.map(item => item.productId);
    const coupon = await this.couponRepository
      .createQueryBuilder('coupon')
      .where('active = true')
      .andWhere('code = :code')
      .andWhere(
        new Brackets(qb =>
          qb.where('end_date IS NULL').orWhere('end_date >= NOW()'),
        ),
      )
      .andWhere('product IN (:...productIds)')
      .andWhere('start_date <= NOW()')
      .setParameters({
        code: payload.code,
        productIds: products,
      })
      .getOneOrFail()
      .catch(err => {
        throw new UnknownCouponCodeException({
          debugDetails: { err },
          errors: ['coupon code not found'],
          meta: {
            payload,
            products,
          },
        });
      });

    const discount = computeDiscountForOrder(coupon, payload.order);
    return {
      amountOff: discount.amountOff,
      code: payload.code,
      discountType: coupon.discountType,
      metadata: {},
      order: {
        ...payload.order,
        totalAmount: payload.order.amount - discount.discount,
        totalDiscountAmount: discount.discount,
      },
      percentOff: discount.percentOff,
      trackingId: this.trackingService.generateTrackingIds({
        coupon,
        customer: payload.customer,
        order: payload.order,
      })?.[0],
      valid: true,
    };
  }

  async verifyCoupon(payload: VerifyCouponBodyDto & VerifyCouponParamsDto) {
    if (!this.compareTrackingId(payload))
      throw new InConsistentTrackingIdException({
        errors: ['TrackingId mismatch'],
        meta: {
          payload,
        },
      });
    const products = payload.order.items.map(item => item.productId);
    const coupon = await this.couponRepository
      .createQueryBuilder('coupon')
      .where('code = :code')
      .andWhere('product IN (:...productIds)')
      .setParameters({
        code: payload.code,
        productIds: products,
      })
      .getOneOrFail()
      .catch(err => {
        throw new UnknownCouponCodeException({
          debugDetails: { err },
          errors: ['coupon code not found'],
          meta: {
            payload,
            products,
          },
        });
      });

    const discount = computeDiscountForOrder(coupon, payload.order);
    return {
      amountOff: discount.amountOff,
      code: payload.code,
      discountType: coupon.discountType,
      metadata: {},
      order: {
        ...payload.order,
        totalAmount: payload.order.amount - discount.discount,
        totalDiscountAmount: discount.discount,
      },
      percentOff: discount.percentOff,
      sessionId: v4(),
      trackingId: payload.trackingId,
      valid: true,
    };
  }

  compareTrackingId(payload: VerifyCouponBodyDto & VerifyCouponParamsDto) {
    return this.trackingService.isTrackingIdMatch({
      coupon: { code: payload.code },
      customer: {
        id: payload.customer.id,
      },
      order: {
        id: payload.order.id,
      },
      trackingId: payload.trackingId,
    });
  }
}

function computeDiscountForOrder(coupon: Coupon, order: VerifyingOrderRequest) {
  if (assertPercentDiscountCoupon(coupon)) {
    const discount = Math.round(order.amount * (coupon.percentOff / 100));
    // From business requirement, it should always integer amount
    return {
      discount: Math.floor(discount / 100) * 100,
      percentOff: coupon.percentOff,
    };
  } else if (assertAmountDiscountCoupon(coupon)) {
    return { amountOff: coupon.amountOff, discount: coupon.amountOff };
  }
  return { amountOff: 0, discount: 0 };
}
