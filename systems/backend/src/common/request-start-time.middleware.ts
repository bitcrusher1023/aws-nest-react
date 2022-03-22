import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestStartTimeMiddleware implements NestMiddleware {
  use(_: Request, res: Response, next: NextFunction) {
    res.locals['startAt'] = new Date().getTime();
    next();
  }
}
