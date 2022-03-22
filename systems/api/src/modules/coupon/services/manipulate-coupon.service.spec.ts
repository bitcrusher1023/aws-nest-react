import { BadRequestException } from '@api/exceptions/BadRequestException';
import { UnprocessableEntityException } from '@api/exceptions/UnprocessableEntityException';
import type { CouponRequestDto } from '@api/modules/coupon/dto/requests/coupon-request.dto';
import { couponBuilder } from '@api-test-helpers/seeders/coupons';
import { describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import type { Repository } from 'typeorm';

import { DiscountType } from '../constants/discount-type.constants';
import type { Coupon } from '../entities/coupon.entity';
import { CouponRepositoryFactory } from './coupon-repository.factory';
import { FindCouponService } from './find-coupon.service';
import { ManipulateCouponService } from './manipulate-coupon.service';

function createTestingModule({
  getRepository,
}: {
  getRepository: (options: {
    discountType: DiscountType;
  }) => Repository<Coupon>;
}) {
  return Test.createTestingModule({
    providers: [
      ManipulateCouponService,
      {
        provide: CouponRepositoryFactory,
        useValue: {
          getRepository,
        },
      },
      {
        provide: FindCouponService,
        useValue: {
          findCouponByCode: jest.fn(),
        },
      },
    ],
  }).compile();
}

describe('ManipulateCouponService', () => {
  it('createCoupon', async () => {
    const mockRepository = {
      save: jest.fn().mockResolvedValue({}),
    };
    const app: TestingModule = await createTestingModule({
      getRepository: jest.fn().mockReturnValue(mockRepository),
    });

    const service = app.get<ManipulateCouponService>(ManipulateCouponService);
    const payload = couponBuilder({
      amountOff: 10,
      code: 'fake-code',
      discountType: DiscountType.Amount,
      endDate: new Date(),
      product: '',
      startDate: new Date(),
    }) as CouponRequestDto;
    await service.createCoupon(payload);
    expect(mockRepository.save).toHaveBeenCalledWith(payload);
  });

  it('createCoupon with throw UnProcessableEntity', async () => {
    const mockRepository = {
      save: jest.fn().mockRejectedValue({ code: '23505' }),
    };
    const app: TestingModule = await createTestingModule({
      getRepository: jest.fn().mockReturnValue(mockRepository),
    });

    const service = app.get<ManipulateCouponService>(ManipulateCouponService);
    const payload = couponBuilder({
      code: 'fake-code',
      discountType: DiscountType.Amount,
      endDate: new Date(),
      startDate: new Date(),
    }) as CouponRequestDto;
    await expect(service.createCoupon(payload)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });

  it('createCoupon with throw BadRequestException', async () => {
    const mockRepository = {
      save: jest.fn().mockRejectedValue({ code: '23514' }),
    };
    const app: TestingModule = await createTestingModule({
      getRepository: jest.fn().mockReturnValue(mockRepository),
    });

    const service = app.get<ManipulateCouponService>(ManipulateCouponService);
    const payload = couponBuilder({
      code: 'fake-code',
      discountType: DiscountType.Amount,
      endDate: new Date(),
      startDate: new Date(),
    }) as CouponRequestDto;
    await expect(service.createCoupon(payload)).rejects.toThrow(
      BadRequestException,
    );
  });
});
