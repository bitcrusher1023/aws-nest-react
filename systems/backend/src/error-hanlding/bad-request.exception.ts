import { HttpException, HttpStatus } from '@nestjs/common';

import type { ErrorCode } from './error-code.constant';

interface InputResponse {
  code: ErrorCode;
  debugDetails?: Record<string, unknown>;
  errors: string[];
  meta?: Record<string, unknown>;
}

export class BadRequestException extends HttpException {
  debugDetails?: Record<string, unknown> | undefined; // Only visible on access log

  constructor(response: InputResponse) {
    const { code, debugDetails, errors, meta } = response;
    super(
      {
        code,
        errors,
        meta,
      },
      HttpStatus.BAD_REQUEST,
    );
    this.debugDetails = debugDetails;
  }
}
