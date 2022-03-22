import { PickType } from '@nestjs/swagger';

import { CouponRequestDto } from './coupon-request.dto';

export class CreateCouponBodyDto extends PickType(CouponRequestDto, [
  'product',
  'code',
  'description',
  'startDate',
  'endDate',
  'active',
  'discountType',
  'amountOff',
  'percentOff',
  'metadata',
  'effect',
] as const) {}
