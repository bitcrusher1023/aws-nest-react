import { HttpException, HttpStatus } from '@nestjs/common';

import type { ErrorCode } from './ErrorCode';

interface InputResponse {
  code: ErrorCode;
  debugDetails?: Record<string, unknown>;
  errors: string[];
  meta?: Record<string, unknown>;
}

export class UnprocessableEntityException extends HttpException {
  debugDetails?: Record<string, unknown> | undefined; // Only visible on access log

  constructor(response: InputResponse) {
    const { code, debugDetails, errors, meta } = response;
    super(
      {
        code,
        errors,
        meta,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
    this.debugDetails = debugDetails;
  }
}
