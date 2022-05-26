import type { GraphQLError } from 'graphql';

export function getGraphqlErrorCodes(errors?: GraphQLError[]) {
  return errors?.map(error => error.extensions['code']);
}
