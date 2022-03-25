import type { Request, Response } from 'express';

export function http(request: Request, response: Response & { body: any }) {
  return {
    method: request?.method,
    params: request?.params,
    query: request?.query,
    referer: request?.headers?.referer,
    request_id: response?.locals?.['reqId'],
    status_code: response?.statusCode,
    url: request?.route?.path ?? request?.url,
    useragent: request?.headers?.['user-agent'],
  };
}
