import { serializeError } from 'serialize-error';

export function err(error: Error) {
  return serializeError(error);
}
