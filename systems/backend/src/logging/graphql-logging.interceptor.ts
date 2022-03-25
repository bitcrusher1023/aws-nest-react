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
export class GraphqlLoggingInterceptor implements NestInterceptor {
  private logger = new Logger(GraphqlLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isGraphql = context.getType().toString() === 'graphql';

    if (!isGraphql) return next.handle();
    const ctx = GqlExecutionContext.create(context);
    const { req, res } = ctx.getContext<{ req: Request; res: Response }>();
    const end = new Date().getTime();
    const { startAt = end } = res?.locals ?? {};
    return next.handle().pipe(
      tap(data => {
        this.logger.log({
          duration: end - startAt,
          graphql: graphql(ctx),
          http: http(req, Object.assign(res || {}, { body: data })),
          message: 'Access Log',
        });
      }),
    );
  }
}
