import { describe, expect, it, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { from, Observable } from 'rxjs';

import { Logger } from './logger';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  it('Should return a observable when intercept is done', async () => {
    const callHandlerSpy = {
      handle: jest.fn().mockReturnValue(new Observable<any>()),
    };
    const executionContextSpy = {
      getRequest: jest.fn().mockReturnValue({
        get() {
          return null;
        },
      }),
      getResponse: jest.fn().mockReturnValue({
        locals: {},
        setHeader() {
          return null;
        },
      }),
      switchToHttp: jest.fn().mockReturnThis(),
    } as any;
    const ApiLoggerSpy = {
      log: jest.fn().mockReturnValue(''),
    };
    const module = await Test.createTestingModule({
      providers: [
        { provide: Logger, useValue: ApiLoggerSpy },
        LoggingInterceptor,
      ],
    }).compile();
    const loggingInterceptor =
      module.get<LoggingInterceptor>(LoggingInterceptor);
    const result = loggingInterceptor.intercept(
      executionContextSpy,
      callHandlerSpy,
    );
    expect(result).toBeInstanceOf(Observable);
  });

  it('Should expect logger.info is called when successful response is returned', async () => {
    const { req, res } = {
      req: {
        get() {
          return null;
        },
        headers: {
          headerA: 'foobar',
          'user-agent': 'Chrome',
        },
        method: 'GET',
        params: {},
        query: {},
        url: '/private/spaces',
      },
      res: {
        locals: {
          reqId: 'foobar',
          startAt: 0,
        },
        setHeader() {
          return null;
        },
        statusCode: 200,
      },
    };

    const callHandlerSpy = {
      handle: jest
        .fn()
        .mockReturnValue(from(Promise.resolve({ bodyAtt1: '' }))),
    };
    const executionContextSpy = {
      getRequest: jest.fn().mockReturnValue(req),
      getResponse: jest.fn().mockReturnValue(res),
      switchToHttp: jest.fn().mockReturnThis(),
    } as any;
    const ApiLoggerSpy = {
      log: jest.fn().mockImplementation(() => null),
    };
    const module = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();
    // @ts-expect-error
    module.useLogger(ApiLoggerSpy);
    const loggingInterceptor =
      module.get<LoggingInterceptor>(LoggingInterceptor);
    await loggingInterceptor
      .intercept(executionContextSpy, callHandlerSpy)
      .toPromise();
    expect(ApiLoggerSpy.log).toHaveBeenCalledWith(
      {
        duration: expect.any(Number),
        http: {
          method: 'GET',
          params: {},
          query: {},
          referer: undefined,
          request_id: 'foobar',
          status_code: 200,
          url: '/private/spaces',
          useragent: 'Chrome',
        },
        message: 'Access Log',
      },
      'LoggingInterceptor',
    );
  });
});
