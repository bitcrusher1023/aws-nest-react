import { HttpException, HttpStatus } from '@nestjs/common';

import type { ExceptionPayload } from './exception-payload';
import { exceptionPayloadToResponse } from './exception-payload';

export class UnauthorizedException extends HttpException {
  debugDetails?: Record<string, unknown> | undefined; // Only visible on access log

  constructor(response: ExceptionPayload) {
    const { code, debugDetails, errors, meta } = response;
    super(
      exceptionPayloadToResponse({
        code,
        errors,
        meta,
      }),
      HttpStatus.UNAUTHORIZED,
    );
    this.debugDetails = debugDetails;
  }
}
