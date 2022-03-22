import { createRequestAgent } from '@api-test-helpers/create-request-agent';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import { withNestServerContext } from '@api-test-helpers/nest-app-context';
import { couponBuilder } from '@api-test-helpers/seeders/coupons';
import { signFakedToken } from '@api-test-helpers/sign-faked-token';
import { describe, expect, it } from '@jest/globals';

import { DiscountType } from '../constants/discount-type.constants';
import { CouponModule } from '../coupon.module';

const appContext = withNestServerContext({
  imports: [CouponModule],
});
describe('POST /admin/v1/coupons', () => {
  it.each`
    code                             | discountType                  | coupon
    ${'amount-off-discount'}         | ${DiscountType.Amount}        | ${{ amountOff: 10 }}
    ${'percent-off-discount'}        | ${DiscountType.Percent}       | ${{ percentOff: 10 }}
    ${'effect-amount-off-discount'}  | ${DiscountType.EffectAmount}  | ${{ amountOff: 10, effect: 'hello' }}
    ${'effect-percent-off-discount'} | ${DiscountType.EffectPercent} | ${{ effect: 'world', percentOff: 10 }}
  `(
    '$discountType coupon - $code created',
    async ({ code, coupon, discountType }) => {
      const app = appContext.app;
      const couponPayload = couponBuilder({
        active: true,
        code,
        discountType,
        ...coupon,
      });
      const { body } = await createRequestAgent(app.getHttpServer())
        .post('/admin/v1/coupons')
        .set('Authorization', signFakedToken(appContext.module))
        .send(couponPayload)
        .expect(expectResponseCode({ expectedStatusCode: 201 }));
      expect(body.data).toStrictEqual({
        active: true,
        code: couponPayload.code,
        description: null,
        discountType: couponPayload.discountType,
        endDate: null,
        id: expect.any(String),
        metadata: {},
        product: couponPayload.product,
        startDate: couponPayload.startDate,
        ...coupon,
      });
    },
  );
});
