import { Inject, LoggerService } from '@nestjs/common';
import type { Logform } from 'winston';

import { Logger } from './logger';
import { Level } from './logging.constants';

function isInfoObj(
  infoObj: Logform.TransformableInfo | string,
): infoObj is Logform.TransformableInfo {
  return typeof infoObj !== 'string';
}

export class NestLogger implements LoggerService {
  constructor(@Inject(Logger) private logger: Logger) {}

  private logMessage(
    level: Level,
    infoObj: Logform.TransformableInfo | string,
    context?: string,
  ) {
    const { message, ...restObj } = isInfoObj(infoObj)
      ? infoObj
      : { message: infoObj };
    this.logger.log(level, message, {
      context,
      ...restObj,
    });
  }

  error(infoObj: Logform.TransformableInfo, trace?: string, context?: string) {
    this.logMessage(
      Level.error,
      isInfoObj(infoObj)
        ? { ...infoObj, trace }
        : { level: Level.error, message: infoObj, trace },
      context,
    );
  }

  log(infoObj: Logform.TransformableInfo, context?: string) {
    this.logMessage(Level.info, infoObj, context);
  }

  warn(infoObj: Logform.TransformableInfo, context?: string) {
    this.logMessage(Level.warn, infoObj, context);
  }
}
