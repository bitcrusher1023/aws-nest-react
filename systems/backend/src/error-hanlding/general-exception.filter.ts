import { Catch, Logger } from '@nestjs/common';
import type { GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-errors';

import { err } from '../logging/formats/err';
import { ErrorCode } from './error-code.constant';

@Catch()
export class GeneralExceptionFilter implements GqlExceptionFilter {
  private logger = new Logger(GeneralExceptionFilter.name);

  catch(exception: Error) {
    const httpException =
      exception instanceof ApolloError
        ? exception
        : new ApolloError(exception.message, ErrorCode.UnhandledError);
    httpException.stack = exception.stack as string;

    this.logger.error(
      {
        duration: 0,
        err: err(httpException),
        message: 'Access Log',
      },
      exception.stack,
    );
    throw httpException;
  }
}
