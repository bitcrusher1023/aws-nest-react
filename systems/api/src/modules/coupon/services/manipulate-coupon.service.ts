import { catchDBError } from '@api/exceptions/catchDBError';
import { FindCouponService } from '@api/modules/coupon/services/find-coupon.service';
import { Injectable } from '@nestjs/common';
import { Dictionary, reject } from 'ramda';
import typeorm from 'typeorm';

import { ActiveState } from '../constants/active-state.constants';
import type { CreateCouponBodyDto } from '../dto/requests/create-coupon.dto';
import type {
  UpdateCouponBodyDto,
  UpdateCouponParamsDto,
} from '../dto/requests/update-coupon.dto';
import type { UpdateCouponActiveParamsDto } from '../dto/requests/update-coupon-active.dto';
import type { Coupon } from '../entities/coupon.entity';
import { CouponRepositoryFactory } from './coupon-repository.factory';

const { Brackets } = typeorm;

function isUndefined(value: undefined | unknown): value is undefined {
  return value === undefined;
}

function rejectUndefined<T>(value: Dictionary<T | undefined>) {
  return reject<T | undefined>(isUndefined)(value);
}

@Injectable()
export class ManipulateCouponService {
  constructor(
    private couponRepositoryFactory: CouponRepositoryFactory,
    private findCouponService: FindCouponService,
  ) {}

  async createCoupon(payload: CreateCouponBodyDto) {
    const repository = this.couponRepositoryFactory.getRepository({
      discountType: payload.discountType,
    });
    const createdCoupon = await repository
      .save(payload)
      .catch<Coupon>(catchDBError);
    return createdCoupon;
  }

  async updateCouponByState(payload: UpdateCouponActiveParamsDto) {
    const now = new Date();
    const coupon = await this.findCouponService.findCouponByCode(payload.code);
    const isRunningCoupon =
      coupon.active &&
      coupon.startDate <= now &&
      (!coupon.endDate || coupon.endDate > now);
    if (isRunningCoupon) {
      if (payload.state === ActiveState.InActive) {
        // @TODO!
        // await this.updateActiveCoupon(coupon.code, {
        //   active: false,
        // });
      }
    } else {
      await this.updateInActiveCoupon(coupon.code, {
        active: payload.state === ActiveState.Active,
      });
    }

    return await this.findCouponService.findCouponByCode(payload.code);
  }

  async updateCoupon(payload: UpdateCouponBodyDto & UpdateCouponParamsDto) {
    const now = new Date();
    const coupon = await this.findCouponService.findCouponByCode(payload.code);
    const isRunningCoupon =
      coupon.active &&
      coupon.startDate <= now &&
      (!coupon.endDate || coupon.endDate > now);
    if (isRunningCoupon) {
      await this.updateActiveCoupon(coupon.code, payload);
    } else {
      await this.updateInActiveCoupon(coupon.code, payload);
    }

    return await this.findCouponService.findCouponByCode(payload.code);
  }

  private async updateActiveCoupon(
    code: string,
    payload: {
      active?: boolean;
      description?: string;
    },
  ) {
    const repository = this.couponRepositoryFactory.getRepository();
    await repository
      .createQueryBuilder()
      .update()
      .where('code = :code', { code })
      .andWhere('active = true')
      .andWhere('start_date <= NOW()')
      .andWhere(
        new Brackets(qb => {
          qb.where('end_date > NOW()').orWhere('end_date IS NULL');
        }),
      )
      .set(
        rejectUndefined<string | boolean>({
          active: payload.active,
          description: payload.description,
        }),
      )
      .execute()
      .catch(catchDBError);
  }

  private async updateInActiveCoupon(
    code: string,
    payload: {
      active?: boolean;
      description?: string;
      endDate?: Date;
      metadata?: Record<string, unknown>;
      startDate?: Date;
    },
  ) {
    const repository = this.couponRepositoryFactory.getRepository();
    await repository
      .createQueryBuilder()
      .update()
      .where('code = :code', {
        code,
      })
      .andWhere(
        new Brackets(qb => {
          qb.where('active = false').orWhere(
            new Brackets(qb => {
              qb.where('active = true').andWhere(
                new Brackets(qb => {
                  qb.where('start_date > NOW()').orWhere('end_date < NOW()');
                }),
              );
            }),
          );
        }),
      )
      .set(
        rejectUndefined({
          active: payload.active,
          description: payload.description,
          endDate: payload.endDate,
          metadata: payload.metadata,
          startDate: payload.startDate,
        }),
      )
      // .printSql()
      .execute()
      .catch(catchDBError);
  }
}
