import { HttpException, HttpStatus } from '@nestjs/common';

interface InputResponse {
  debugDetails?: Record<string, unknown>;
  errors: string[];
  meta?: Record<string, unknown>;
}

export class InConsistentTrackingIdException extends HttpException {
  debugDetails?: Record<string, unknown> | undefined; // Only visible on access log

  constructor(response: InputResponse) {
    const { debugDetails, errors, meta } = response;
    super(
      {
        code: 'ERR_INCONSISTENT_TRACKING_ID',
        errors,
        meta,
      },
      HttpStatus.BAD_REQUEST,
    );
    this.debugDetails = debugDetails;
  }
}
