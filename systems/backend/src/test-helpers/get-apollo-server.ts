import type { INestApplication } from '@nestjs/common';
import type { DocumentNode, GraphQLError } from 'graphql';
import { print } from 'graphql/language/printer';

import { expectResponseCode } from './expect-response-code';
import { getRequestAgent } from './get-request-agent';

// The reason why I don't use getApolloServer from @nestjs/apollo is because
// https://github.com/apollographql/apollo-server/issues/2277
// this function can make req, res available on apollo context
export function getApolloServer(app: INestApplication) {
  const requestAgent = getRequestAgent(app.getHttpServer());
  return {
    async executeOperation<D = any>({
      http,
      query,
      variables,
    }: {
      http?: {
        headers?: Record<string, string>;
      };
      query: DocumentNode;
      variables?: Record<string, any>;
    }): Promise<{ data: D; errors?: GraphQLError[] }> {
      const requestChain = requestAgent.post('/graphql');
      Object.entries(http?.headers ?? {}).forEach(([key, value]) => {
        requestChain.set(key, value);
      });
      const { body } = await requestChain
        .send({ query: print(query), variables })
        .expect(
          expectResponseCode({
            expectedStatusCode: 200,
            message: `GraphQL query should always return status code 200
see https://www.apollographql.com/docs/apollo-server/data/errors/#returning-http-status-codes`,
          }),
        );
      return body;
    },
  };
}
