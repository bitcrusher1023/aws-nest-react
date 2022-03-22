import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, res: Response, next: NextFunction) {
    const reqId =
      request.get('REQ-ID') || request.get('X-Amz-Cf-Id') || uuidv4();
    res.locals['reqId'] = reqId;
    res.setHeader('request-id', reqId);
    next();
  }
}
