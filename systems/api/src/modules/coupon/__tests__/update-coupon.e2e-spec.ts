import { createRequestAgent } from '@api-test-helpers/create-request-agent';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
import { getTestName } from '@api-test-helpers/jest/get-test-name';
import { withNestServerContext } from '@api-test-helpers/nest-app-context';
import {
  couponBuilder,
  createCouponInDB,
} from '@api-test-helpers/seeders/coupons';
import { signFakedToken } from '@api-test-helpers/sign-faked-token';
import { describe, expect, it } from '@jest/globals';
import { DateTime } from 'luxon';

import { DiscountType } from '../constants/discount-type.constants';
import { CouponModule } from '../coupon.module';

const now = DateTime.now();
const appContext = withNestServerContext({
  imports: [CouponModule],
});
describe('PATCH /admin/v1/coupons/:code', () => {
  it.each([undefined, now.endOf('month').toJSDate().toISOString()])(
    'Only update description for running coupon - end_date is %s',
    async endDate => {
      const app = appContext.app;
      const coupon = couponBuilder({
        active: true,
        amountOff: 10,
        code: getTestName(),
        discountType: DiscountType.Amount,
        endDate: endDate ?? undefined,
      });
      await createCouponInDB(appContext.module, [coupon]);
      const { body } = await createRequestAgent(app.getHttpServer())
        .patch(`/admin/v1/coupons/${encodeURIComponent(coupon.code)}`)
        .set('Authorization', signFakedToken(appContext.module))
        .send({
          ...coupon,
          amountOff: 100,
          description: 'hello world',
          startDate: now
            .startOf('month')
            .plus({
              days: 10,
            })
            .toJSDate(),
        })
        .expect(expectResponseCode({ expectedStatusCode: 200 }));
      expect(body.data).toStrictEqual({
        active: true,
        amountOff: 10,
        code: coupon.code,
        description: 'hello world',
        discountType: 'AMOUNT',
        endDate: coupon.endDate ?? null,
        id: expect.any(String),
        metadata: {},
        product: 'fake-product-id',
        startDate: coupon.startDate,
      });
    },
  );

  it('Can update start date & end date for active but not yep started coupon', async () => {
    const app = appContext.app;
    const coupon = couponBuilder({
      active: true,
      amountOff: 10,
      code: 'dummy-code-002',
      discountType: DiscountType.Amount,
      startDate: now.endOf('month').toJSDate(),
    });
    await createCouponInDB(appContext.module, [coupon]);
    const { body } = await createRequestAgent(app.getHttpServer())
      .patch(`/admin/v1/coupons/${coupon.code}`)
      .set('Authorization', signFakedToken(appContext.module))
      .send({
        ...coupon,
        amountOff: 100,
        description: 'hello world',
        endDate: now.endOf('month').toJSDate(),
        startDate: now.startOf('month').toJSDate(),
      })
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(body.data).toStrictEqual({
      active: true,
      amountOff: 10,
      code: 'dummy-code-002',
      description: 'hello world',
      discountType: 'AMOUNT',
      endDate: now.endOf('month').toUTC().toString(),
      id: expect.any(String),
      metadata: {},
      product: 'fake-product-id',
      startDate: now.startOf('month').toUTC().toString(),
    });
  });

  it('Can update start date & end date for active but ended coupon', async () => {
    const app = appContext.app;
    const endDate = now.startOf('month');
    const coupon = couponBuilder({
      active: true,
      amountOff: 10,
      code: 'dummy-code-003',
      discountType: DiscountType.Amount,
      endDate: endDate.toJSDate(),
      startDate: endDate.plus({ months: -1 }).toJSDate(),
    });
    await createCouponInDB(appContext.module, [coupon]);
    const { body } = await createRequestAgent(app.getHttpServer())
      .patch(`/admin/v1/coupons/${coupon.code}`)
      .set('Authorization', signFakedToken(appContext.module))
      .send({
        ...coupon,
        amountOff: 100,
        description: 'hello world',
        endDate: now.endOf('month').toJSDate(),
        startDate: now.startOf('month').toJSDate(),
      })
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(body.data).toStrictEqual({
      active: true,
      amountOff: 10,
      code: 'dummy-code-003',
      description: 'hello world',
      discountType: 'AMOUNT',
      endDate: now.endOf('month').toUTC().toString(),
      id: expect.any(String),
      metadata: {},
      product: 'fake-product-id',
      startDate: now.startOf('month').toUTC().toString(),
    });
  });
});
