import { describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import typeorm from 'typeorm';

import { Coupon } from '../entities/coupon.entity';
import { FindCouponService } from './find-coupon.service';

const { In } = typeorm;

describe('FindManyCouponService', () => {
  it('findManyCoupon', async () => {
    const mockRepository = {
      findAndCount: jest.fn().mockResolvedValue([[{}, {}], 4]),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        FindCouponService,
        {
          provide: getRepositoryToken(Coupon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    const service = app.get<FindCouponService>(FindCouponService);
    const filter = {
      limit: 10,
      products: ['abc', 'efg'],
      skip: 0,
    };
    const results = await service.findManyCoupon(filter);
    expect(mockRepository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      where: {
        product: In(filter.products),
      },
    });
    expect(results.total).toEqual(4);
    expect(results.matchedCoupon).toHaveLength(2);
  });

  it('findManyCoupon allow skip productIds', async () => {
    const mockRepository = {
      findAndCount: jest.fn().mockResolvedValue([[{}, {}], 4]),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        FindCouponService,
        {
          provide: getRepositoryToken(Coupon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    const service = app.get<FindCouponService>(FindCouponService);
    const filter = {
      limit: 20,
      skip: 0,
    };
    await service.findManyCoupon(filter);
    expect(mockRepository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 20,
      where: {},
    });
  });
});
