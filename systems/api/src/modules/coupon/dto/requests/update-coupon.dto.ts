import { PickType } from '@nestjs/swagger';

import { CouponRequestDto } from './coupon-request.dto';

export class UpdateCouponBodyDto extends PickType(CouponRequestDto, [
  'description',
  'startDate',
  'endDate',
  'metadata',
] as const) {}

export class UpdateCouponParamsDto extends PickType(CouponRequestDto, [
  'code',
] as const) {}
