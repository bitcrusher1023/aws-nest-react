import { describe, expect, it } from '@jest/globals';
import { getApolloServer } from '@nestjs/apollo';
import { Controller, Get, ImATeapotException } from '@nestjs/common';
import { Field, ID, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-errors';
import gql from 'graphql-tag';

import { createRequestAgent } from '../test-helpers/create-request-agent';
import { expectResponseCode } from '../test-helpers/expect-response-code';
import { withNestServerContext } from '../test-helpers/nest-app-context';
import { ErrorCode } from './error-code.constant';

@ObjectType()
class TestModel {
  @Field(() => ID)
  id!: string;
}

@Resolver(() => TestModel)
class TestResolver {
  @Query(() => TestModel)
  testQuery() {
    throw new Error('Fake Error!!!');
  }

  @Query(() => TestModel)
  testQueryWithApolloError() {
    throw new ApolloError('Foobar', 'ERR_CREATE_RECORD');
  }
}

@Controller('/test-case')
class TestController {
  @Get('/unexpected-error')
  getUnexpectedError() {
    throw new Error('Fake Error!!!');
  }

  @Get('/418')
  get418() {
    throw new ImATeapotException({
      code: ErrorCode.UnhandledError,
      errors: ['Foobar'],
      meta: {},
    });
  }
}

const appContext = withNestServerContext({
  controllers: [TestController],
  imports: [],
  providers: [TestResolver],
});

describe('General exception filter', () => {
  it('query rest with unexpected-error', async () => {
    const app = appContext.app;
    const { body } = await createRequestAgent(app.getHttpServer())
      .get('/test-case/unexpected-error')
      .expect(expectResponseCode({ expectedStatusCode: 500 }));
    expect(body).toStrictEqual({
      code: 'ERR_UNHANDLED',
      errors: ['Fake Error!!!'],
      meta: {
        exception: {
          message: 'Fake Error!!!',
          name: 'Error',
        },
      },
      stack: expect.any(String),
    });
  });
  it('query rest with http error', async () => {
    const app = appContext.app;
    const { body } = await createRequestAgent(app.getHttpServer())
      .get('/test-case/418')
      .expect(expectResponseCode({ expectedStatusCode: 418 }));
    expect(body).toStrictEqual({
      code: 'ERR_UNHANDLED',
      errors: ['Foobar'],
      meta: {},
      stack: expect.any(String),
    });
  });
  it('query graphql endpoint that throw unknown error', async () => {
    const app = appContext.app;
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
    expect(resp.errors).toBeDefined();
    expect(resp.errors).toStrictEqual([
      {
        extensions: {
          code: 'ERR_UNHANDLED',
          exception: {
            originalError: expect.anything(),
          },
        },
        locations: [
          {
            column: 3,
            line: 2,
          },
        ],
        message: 'Fake Error!!!',
        path: ['testQuery'],
      },
    ]);
  });
  it('query graphql endpoint that throw apollo error', async () => {
    const app = appContext.app;
    const server = getApolloServer(app);
    const UNDEFINED = gql`
      query Test {
        testQueryWithApolloError {
          id
        }
      }
    `;
    const resp = await server.executeOperation({
      query: UNDEFINED,
    });
    expect(resp.errors).toBeDefined();
    expect(resp.errors).toStrictEqual([
      {
        extensions: {
          code: 'ERR_CREATE_RECORD',
          exception: {
            originalError: expect.anything(),
          },
        },
        locations: [
          {
            column: 3,
            line: 2,
          },
        ],
        message: 'Foobar',
        path: ['testQueryWithApolloError'],
      },
    ]);
  });
});
