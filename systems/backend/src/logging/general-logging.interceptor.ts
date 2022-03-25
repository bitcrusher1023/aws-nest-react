import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { graphql } from './formats/graphql';
import { http } from './formats/http';

@Injectable()
export class GeneralLoggingInterceptor implements NestInterceptor {
  private logger = new Logger(GeneralLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isGraphql = context.getType().toString() === 'graphql';

    if (!isGraphql) return this.interceptHttpRequest(context, next);
    return this.interceptGraphqlRequest(context, next);
  }

  interceptHttpRequest(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const isDefaultPath = request?.route?.path === '/*';
    if (isDefaultPath) return next.handle();
    return next.handle().pipe(
      tap(data => {
        const { startAt } = response.locals;
        const end = new Date().getTime();
        this.logger.log(
          {
            duration: end - startAt,
            http: http(
              request,
              Object.assign(response, {
                body: data,
              }),
            ),
            message: 'Access Log',
          },
          GeneralLoggingInterceptor.name,
        );
      }),
    );
  }

  interceptGraphqlRequest(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const { req, res } = ctx.getContext<{ req: Request; res: Response }>();
    const end = new Date().getTime();
    const { startAt = end } = res?.locals ?? {};
    return next.handle().pipe(
      tap(data => {
        this.logger.log(
          {
            duration: end - startAt,
            graphql: graphql(ctx),
            http: http(req, Object.assign(res || {}, { body: data })),
            message: 'Access Log',
          },
          GeneralLoggingInterceptor.name,
        );
      }),
    );
  }
}
