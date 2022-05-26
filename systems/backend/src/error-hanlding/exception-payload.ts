import type { ErrorCode } from './error-code.constant';

export interface ExceptionPayload {
  code: ErrorCode;
  debugDetails?: Record<string, unknown>;
  errors: { code?: ErrorCode; detail?: string; title: string }[];
  meta?: Record<string, unknown>;
}

export function exceptionPayloadToResponse(payload: ExceptionPayload) {
  const isErrorsEmpty = (payload.errors?.length ?? 0) === 0;
  return {
    errors: isErrorsEmpty
      ? [{ code: payload.code }]
      : payload.errors.map(({ detail, title }) => ({
          code: payload.code,
          detail,
          title,
        })),
    meta: payload.meta,
  };
}
