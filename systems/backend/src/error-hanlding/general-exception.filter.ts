import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import type { Request } from 'express';

import { catchGraphqlError } from './catch-graphql-error';
import { catchHttpError } from './catch-http-error';

@Catch()
export class GeneralExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GeneralExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest<Request>();
    const url = req?.url;

    if (!url || url === '/graphql')
      throw catchGraphqlError(this.logger, exception, host);
    catchHttpError(this.logger, exception, host);
  }
}
