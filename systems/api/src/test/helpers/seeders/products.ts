import type { VerifyingOrderItemRequest } from '@api/modules/coupon/dto/requests/verify-coupon.dto';

export function productBuilder(
  override?: Partial<VerifyingOrderItemRequest>,
): any {
  const result = {
    price: 0,
    productId: 'fake-product-id',
    quantity: 1,
    ...override,
  };
  return result;
}
