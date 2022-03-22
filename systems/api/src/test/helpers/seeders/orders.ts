import type { VerifyingOrderRequest } from '@api/modules/coupon/dto/requests/verify-coupon.dto';

import { productBuilder } from './products';

export function orderBuilder(override?: Partial<VerifyingOrderRequest>): any {
  const result = {
    id: 'fake-order-id',
    items: [productBuilder({ price: override?.amount ?? 0 })],
    metadata: {},
    ...override,
  };
  return result;
}
