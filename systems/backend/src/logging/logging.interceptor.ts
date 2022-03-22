import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { http } from './formats/http';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      tap((data) => {
        const { startAt } = response.locals;
        const end = new Date().getTime();
        this.logger.log({
          duration: end - startAt,
          http: http(request, {
            ...response,
            body: data,
          }),
          message: 'Access Log',
        });
      }),
    );
  }
}
