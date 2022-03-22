import { ErrorCode } from '@api/exceptions/ErrorCode';
import type { QueryFailedError } from 'typeorm';

import { BadRequestException } from './BadRequestException';
import { UnprocessableEntityException } from './UnprocessableEntityException';

export function catchDBError(e: QueryFailedError & { code: string }): any {
  if (e.code === '23505')
    throw new UnprocessableEntityException({
      code: ErrorCode.CreateRecordError,
      debugDetails: {
        error: e,
        fromDB: true,
      },
      errors: [e.message],
      meta: {},
    });
  if (['23514', '23502'].includes(e.code))
    throw new BadRequestException({
      code: ErrorCode.ValidationError,
      debugDetails: {
        error: e,
        fromDB: true,
      },
      errors: [e.message],
    });
  throw e;
}
