import { BaseAPIResponse } from '@api/dto/responses/base-api-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class VerifyingOrderItemResponse {
  @Expose()
  price!: number;

  @Expose()
  productId!: string;

  @Expose()
  quantity!: number;
}

@Exclude()
export class VerifyingOrderResponse {
  @Expose()
  id!: string;

  @Expose()
  amount!: number;

  @Expose()
  totalAmount!: number;

  @Expose()
  totalDiscountAmount!: number;

  @Expose()
  items!: VerifyingOrderItemResponse[];

  @Expose()
  metadata?: Record<string, unknown>;
}

@Exclude()
class VerifyCouponResponse {
  @Type(() => VerifyingOrderResponse)
  @Expose()
  order!: VerifyingOrderResponse;

  @Expose()
  discountType!: string;

  @Expose()
  code!: string;

  @Expose()
  amountOff?: number | undefined;

  @Expose()
  metadata!: Record<string, unknown>;

  @Expose()
  percentOff?: number | undefined;

  @Expose()
  trackingId!: string;

  @Expose()
  valid!: boolean;
}

@Exclude()
export class VerifyCouponResponseDto extends BaseAPIResponse<VerifyCouponResponse> {
  @Type(() => VerifyCouponResponse)
  @Expose()
  data: VerifyCouponResponse;

  @Expose()
  meta: Record<string, unknown>;

  constructor(coupon: VerifyCouponResponse) {
    super();
    this.data = coupon;
    this.meta = {};
  }
}
