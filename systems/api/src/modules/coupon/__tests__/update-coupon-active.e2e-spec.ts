import { createRequestAgent } from '@api-test-helpers/create-request-agent';
import { expectResponseCode } from '@api-test-helpers/expect-response-code';
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
describe('PATCH /admin/v1/coupons/:code/:state', () => {
  it('Active coupon that inactive', async () => {
    const app = appContext.app;
    const coupon = couponBuilder({
      active: false,
      amountOff: 10,
      code: 'dummy-code-002',
      discountType: DiscountType.Amount,
      startDate: now.endOf('month').toJSDate(),
    });
    await createCouponInDB(appContext.module, [coupon]);
    const { body } = await createRequestAgent(app.getHttpServer())
      .patch(`/admin/v1/coupons/${coupon.code}/active`)
      .set('Authorization', signFakedToken(appContext.module))
      .send({})
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(body.data.active).toStrictEqual(true);
  });

  it('Inactive coupon that active but end already', async () => {
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
      .patch(`/admin/v1/coupons/${coupon.code}/in-active`)
      .set('Authorization', signFakedToken(appContext.module))
      .send({})
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(body.data.active).toStrictEqual(false);
  });

  it('Inactive coupon that active but not yet start', async () => {
    const app = appContext.app;
    const coupon = couponBuilder({
      active: true,
      amountOff: 10,
      code: 'dummy-code-004',
      discountType: DiscountType.Amount,
      startDate: now.plus({ months: 1 }).toJSDate(),
    });
    await createCouponInDB(appContext.module, [coupon]);
    const { body } = await createRequestAgent(app.getHttpServer())
      .patch(`/admin/v1/coupons/${coupon.code}/in-active`)
      .set('Authorization', signFakedToken(appContext.module))
      .send({})
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(body.data.active).toStrictEqual(false);
  });

  it.todo('Inactive coupon that active that already running');
});
