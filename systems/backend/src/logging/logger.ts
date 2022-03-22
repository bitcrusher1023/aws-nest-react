import { Injectable } from '@nestjs/common';
import type { Logform } from 'winston';
import { createLogger } from 'winston';

import type { Level } from './logging.constants';
import { WinstonConfig } from './winston-config';

@Injectable()
export class Logger {
  private winstonLogger = createLogger(WinstonConfig);

  log(
    level: Level,
    message: string,
    infoObj: Omit<Logform.TransformableInfo, 'message'>,
  ) {
    this.winstonLogger.log(level, message, infoObj);
  }
}
