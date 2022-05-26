import { describe, expect, it } from '@jest/globals';
import { Controller, Get, ImATeapotException } from '@nestjs/common';
import {
  Args,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { randomUUID } from 'crypto';
import gql from 'graphql-tag';

import { expectResponseCode } from '../test-helpers/expect-response-code';
import { getApolloServer } from '../test-helpers/get-apollo-server';
import { getGraphqlErrorCodes } from '../test-helpers/get-graphql-error';
import { getRequestAgent } from '../test-helpers/get-request-agent';
import { withNestServerContext } from '../test-helpers/nest-app-context';
import { ApolloException } from './apollo.exception';

@ObjectType()
class TestModel {
  @Field(() => ID)
  id!: string;
}

@InputType()
class TestInput {
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
    throw new ApolloException({
      code: 'ERR_CREATE_RECORD' as any,
      errors: [{ title: 'Foobar' }],
    });
  }

  @Mutation(() => TestModel)
  testMutation(@Args('data') data: TestInput) {
    return { data, id: randomUUID() };
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
      code: 'ERR_TEA_POT_IS_HOT',
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
  describe('rest', () => {
    it('should response code ERR_UNHANDLED when endpoint response generic error', async () => {
      const app = appContext.app;
      const { body } = await getRequestAgent(app.getHttpServer())
        .get('/test-case/unexpected-error')
        .expect(expectResponseCode({ expectedStatusCode: 500 }));
      expect(body).toStrictEqual({
        errors: [
          {
            code: 'ERR_UNHANDLED',
            detail: 'Fake Error!!!',
            title: 'Error',
          },
        ],
        meta: {
          exception: {
            message: 'Fake Error!!!',
            name: 'Error',
          },
        },
        stack: expect.any(String),
      });
    });
    it('should forward response code when endpoint have specific error code', async () => {
      const app = appContext.app;
      const { body } = await getRequestAgent(app.getHttpServer())
        .get('/test-case/418')
        .expect(expectResponseCode({ expectedStatusCode: 418 }));
      expect(body).toStrictEqual({
        code: 'ERR_TEA_POT_IS_HOT',
        errors: ['Foobar'],
        meta: {},
        stack: expect.any(String),
      });
    });
  });

  describe('graphql', () => {
    it('call graphql query endpoint that throw unknown error', async () => {
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
            errors: [
              {
                detail: 'Fake Error!!!',
                title: 'Error',
              },
            ],
          },
          locations: [
            {
              column: 3,
              line: 2,
            },
          ],
          message: 'Graphql Error',
          path: ['testQuery'],
        },
      ]);
    });
    it('call graphql query endpoint that throw apollo error', async () => {
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
            errors: [
              {
                title: 'Foobar',
              },
            ],
          },
          locations: [
            {
              column: 3,
              line: 2,
            },
          ],
          message: 'Graphql Error',
          path: ['testQueryWithApolloError'],
        },
      ]);
    });
    it('call graphql mutation endpoint and missing data', async () => {
      const app = appContext.app;
      const server = getApolloServer(app);
      const TEST_MUTATION = gql`
        mutation Test($data: TestInput!) {
          testMutation(data: $data) {
            id
          }
        }
      `;
      const resp = await server.executeOperation({
        query: TEST_MUTATION,
        variables: {
          data: {},
        },
      });
      expect(resp.errors).toBeDefined();
      expect(getGraphqlErrorCodes(resp.errors)).toEqual(['BAD_USER_INPUT']);
    });
  });
});
