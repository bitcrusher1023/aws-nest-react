import { BaseAPIResponse } from '@api/dto/responses/base-api-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

import { CouponResponseDto } from './coupon-response.dto';

@Exclude()
export class SingleCouponResponseDto extends BaseAPIResponse<CouponResponseDto> {
  @Type(() => CouponResponseDto)
  @Expose()
  data: CouponResponseDto;

  @Expose()
  meta: Record<string, unknown>;

  constructor(coupon: CouponResponseDto) {
    super();
    this.data = coupon;
    this.meta = {};
  }
}
