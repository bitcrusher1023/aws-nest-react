import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { ApolloError, toApolloError } from 'apollo-server-errors';
import type { Request, Response } from 'express';
import { omit } from 'ramda';
import { serializeError } from 'serialize-error';

import { AppEnvironment } from '../config/config.constants';
import { err } from '../logging/formats/err';
import { graphql } from '../logging/formats/graphql';
import { http } from '../logging/formats/http';
import { ErrorCode } from './error-code.constant';

@Catch()
export class GeneralExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GeneralExceptionFilter.name);

  constructor(private config: ConfigService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const isGraphql = host.getType().toString() === 'graphql';

    if (isGraphql) return this.catchGraphqlError(exception, host);
    return this.catchHttpError(exception, host);
  }

  private catchGraphqlError(
    exception: Error & {
      extensions?: Record<string, any>;
    },
    context: ArgumentsHost,
  ) {
    const ctx = GqlArgumentsHost.create(context);

    const isApolloError = exception.extensions;
    const apolloError: ApolloError = (
      isApolloError
        ? exception
        : toApolloError(exception, ErrorCode.UnhandledError)
    ) as ApolloError;
    if (!isApolloError) apolloError.originalError = exception;
    const { req, res } = ctx.getContext<{ req: Request; res: Response }>();
    const end = new Date().getTime();
    const { startAt = end } = res?.locals ?? {};
    this.logger.error(
      {
        duration: end - startAt,
        err: err(apolloError),
        graphql: graphql(ctx),
        http: http(req, Object.assign(res || {}, { body: {} })),
        message: 'Access Log',
      },
      exception.stack,
    );
    throw apolloError;
  }

  private catchHttpError(exception: Error, context: ArgumentsHost) {
    const isPrd = this.config.get('env') === AppEnvironment.PRD;
    const ctx = context.switchToHttp();

    const request = ctx.getRequest<Request>();

    const response = ctx.getResponse<Response>();

    const httpException =
      exception instanceof HttpException
        ? exception
        : new InternalServerErrorException({
            code: ErrorCode.UnhandledError,
            errors: [exception.message],
            meta: { exception: omit(['stack'])(serializeError(exception)) },
          });
    httpException.stack = exception.stack as string;

    const stack = !isPrd ? { stack: exception.stack } : {};

    const { body, status } = {
      body: {
        ...(httpException.getResponse() as Record<string, unknown>),
        ...stack,
      },
      status: httpException.getStatus(),
    };
    const { startAt } = response.locals;
    const end = new Date().getTime();
    // accessLog repeated here Because NestJS interceptor can't capture error throw from guard
    // https://stackoverflow.com/questions/61087776/interceptor-not-catching-error-thrown-by-guard-in-nestjs
    // https://docs.nestjs.com/faq/request-lifecycle
    response.status(status).json(body);

    this.logger.error(
      {
        duration: end - startAt,
        err: err(httpException),
        http: http(request, Object.assign(response, { body })),
        message: 'Access Log',
      },
      exception.stack,
    );
  }
}
