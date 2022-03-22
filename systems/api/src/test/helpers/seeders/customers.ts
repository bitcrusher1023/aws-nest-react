import type { VerifyingCustomerRequest } from '@api/modules/coupon/dto/requests/verify-coupon.dto';

export function customBuilder(
  override?: Partial<VerifyingCustomerRequest>,
): any {
  const result = {
    id: 'fake-customer-id',
    ...override,
  };
  return result;
}
