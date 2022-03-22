import { Exclude, Expose, Type } from 'class-transformer';

import { DiscountType } from '../../constants/discount-type.constants';

@Exclude()
export class CouponResponseDto {
  @Expose()
  id!: string;

  @Expose()
  active!: boolean;

  @Expose()
  product!: string;

  @Expose()
  code!: string;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => Date)
  startDate!: Date;

  @Expose()
  @Type(() => Date)
  endDate?: Date;

  @Expose()
  discountType!: DiscountType;

  @Expose()
  amountOff?: number;

  @Expose()
  percentOff?: number;

  @Expose()
  effect?: string;

  @Expose()
  metadata?: Record<string, unknown>;
}
