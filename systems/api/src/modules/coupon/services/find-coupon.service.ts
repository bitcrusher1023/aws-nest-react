import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import typeorm from 'typeorm';

import type { FindManyCouponQueryDto } from '../dto/requests/find-many-coupon.dto';
import { Coupon } from '../entities/coupon.entity';

const { In } = typeorm;

@Injectable()
export class FindCouponService {
  constructor(
    @InjectRepository(Coupon) private couponRepository: Repository<Coupon>,
  ) {}

  async findManyCoupon(query: FindManyCouponQueryDto) {
    const { limit, skip, ...filter } = query;

    const [matchedCoupon, total] = await this.couponRepository.findAndCount({
      skip: skip,
      take: limit,
      where: {
        ...(filter.products ? { product: In(filter.products) } : {}),
      },
    });
    return {
      matchedCoupon,
      total,
    };
  }

  async findCouponByCode(code: string) {
    return await this.couponRepository.findOneOrFail({
      where: {
        code,
      },
    });
  }
}
