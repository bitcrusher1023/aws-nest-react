import type { ArgumentsHost, Logger } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-errors';

import { err } from '../logging/formats/err';
import { graphql } from '../logging/formats/graphql';
import { ErrorCode } from './error-code.constant';

export function catchGraphqlError(
  logger: Logger,
  exception: Error,
  context: ArgumentsHost,
) {
  const ctx = GqlArgumentsHost.create(context);

  const apolloError =
    exception instanceof ApolloError
      ? exception
      : new ApolloError(exception.message, ErrorCode.UnhandledError);
  apolloError.originalError = exception;
  logger.error(
    'Error Log',
    {
      duration: 0,
      err: err(apolloError),
      graphql: graphql(ctx),
      message: 'Access Log',
    },
    exception.stack,
  );
  throw apolloError;
}
