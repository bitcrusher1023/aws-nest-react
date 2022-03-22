import {
  MultiItemApiResponseDto,
  PaginateInfo,
  PaginateObject,
} from '@api/dto/responses/multi-item-api-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

import { CouponResponseDto } from './coupon-response.dto';

@Exclude()
class PaginateCouponObject implements PaginateObject<CouponResponseDto> {
  @Type(() => CouponResponseDto)
  @Expose()
  items!: CouponResponseDto[];
}

@Exclude()
export class ManyCouponResponseDto extends MultiItemApiResponseDto<PaginateCouponObject> {
  @Type(() => PaginateCouponObject)
  @Expose()
  data: PaginateCouponObject;

  @Type(() => PaginateInfo)
  @Expose()
  meta: PaginateInfo;

  constructor(coupons: CouponResponseDto[], paginateInfo: PaginateInfo) {
    super();
    this.data = { items: coupons };
    this.meta = paginateInfo;
  }
}
