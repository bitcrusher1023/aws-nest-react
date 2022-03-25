import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { getApolloServer } from '@nestjs/apollo';
import { Controller, Get, LoggerService } from '@nestjs/common';
import { Field, ID, ObjectType, Query, Resolver } from '@nestjs/graphql';
import gql from 'graphql-tag';

import { createRequestAgent } from '../test-helpers/create-request-agent';
import { expectResponseCode } from '../test-helpers/expect-response-code';
import {
  startTestingServer,
  withNestModuleBuilderContext,
} from '../test-helpers/nest-app-context';
import Mock = jest.Mock;
import type { NestExpressApplication } from '@nestjs/platform-express';

@ObjectType()
class TestModel {
  @Field(() => ID)
  id!: string;
}

@Resolver(() => TestModel)
class TestResolver {
  @Query(() => TestModel)
  testQuery() {
    return { id: 'hello world' };
  }
}

@Controller('/test-case')
class TestController {
  @Get('/happy-endpoint')
  get() {
    return { data: { message: 'I am happy' } };
  }
}

const moduleBuilderContext = withNestModuleBuilderContext({
  controllers: [TestController],
  imports: [],
  providers: [TestResolver],
});

describe('General logging interceptor', () => {
  let app: NestExpressApplication;
  let logger: LoggerService;
  beforeEach(async () => {
    const module = await moduleBuilderContext.moduleBuilder.compile();
    app = module.createNestApplication<NestExpressApplication>();
    logger = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
    };

    app.useLogger(logger);
    app.setViewEngine('hbs');

    await startTestingServer(app);
  });
  afterEach(async () => {
    await app?.close();
  });

  it('query graphql resolver', async () => {
    const server = getApolloServer(app);
    const UNDEFINED = gql`
      query Test {
        testQuery {
          id
        }
      }
    `;
    const resp = await server.executeOperation({
      query: UNDEFINED,
    });
    expect(resp.data).toBeDefined();
    expect(logger.log).toHaveBeenCalled();
    const logFunction = logger.log as Mock;
    const interceptorCall = logFunction.mock.calls.find(
      call => call[2] === 'GeneralLoggingInterceptor',
    );
    expect(interceptorCall).toBeDefined();
    const [loggingParams] = interceptorCall;
    expect(loggingParams).toStrictEqual({
      duration: 0,
      graphql: {
        args: {},
        info: expect.anything(),
        root: undefined,
      },
      http: {
        method: undefined,
        params: undefined,
        query: undefined,
        referer: undefined,
        request_id: undefined,
        status_code: undefined,
        url: undefined,
        useragent: undefined,
      },
      message: 'Access Log',
    });
  });
  it('query rest endpoint', async () => {
    await createRequestAgent(app.getHttpServer())
      .get('/test-case/happy-endpoint')
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(logger.log).toHaveBeenCalled();
    const logFunction = logger.log as Mock;
    const interceptorCall = logFunction.mock.calls.find(
      call => call[2] === 'GeneralLoggingInterceptor',
    );
    expect(interceptorCall).toBeDefined();
    const [loggingParams] = interceptorCall;
    expect(loggingParams).toStrictEqual({
      duration: expect.any(Number),
      http: {
        method: 'GET',
        params: {},
        query: {},
        referer: undefined,
        request_id: expect.any(String),
        status_code: 200,
        url: '/test-case/happy-endpoint',
        useragent: undefined,
      },
      message: 'Access Log',
    });
  });
});
