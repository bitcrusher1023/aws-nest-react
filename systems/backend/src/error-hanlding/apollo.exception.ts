import { ApolloError } from 'apollo-server-errors';

import type { ExceptionPayload } from './exception-payload';

export class ApolloException extends ApolloError {
  constructor(response: ExceptionPayload) {
    super('Graphql Error', response.code, { errors: response?.errors ?? [] });
  }
}
