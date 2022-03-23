import {
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { AppEnvironment } from '../config/config.constants';
import { err } from '../logging/formats/err';
import { http } from '../logging/formats/http';
import { ErrorCode } from './error-code.constant';

export function catchHttpError(
  logger: Logger,
  exception: Error,
  context: ArgumentsHost,
) {
  const ctx = context.switchToHttp();

  const request = ctx.getRequest<Request>();

  const response = ctx.getResponse<Response>();

  const httpException =
    exception instanceof HttpException
      ? exception
      : new InternalServerErrorException({
          code: ErrorCode.UnhandledError,
          errors: [exception.message],
          meta: { exception },
        });
  httpException.stack = exception.stack as string;

  const stack =
    process.env['NODE_ENV'] !== AppEnvironment.PRD
      ? { stack: exception.stack }
      : {};

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

  logger.error(
    {
      duration: end - startAt,
      err: err(httpException),
      http: http(request, Object.assign(response, { body })),
      message: 'Access Log',
    },
    exception.stack,
  );
}
