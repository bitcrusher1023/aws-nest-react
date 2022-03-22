import { describe, expect, it, jest } from '@jest/globals';

import { RequestStartTimeMiddleware } from './request-start-time.middleware';

describe('Test RequestIdMiddleware', () => {
  it("set request id from request header['REQ-ID']", () => {
    const request: any = {};
    const response: any = {
      locals: {},
    };
    new RequestStartTimeMiddleware().use(request, response, jest.fn());
    expect(response.locals.startAt).toBeDefined();
  });
});
