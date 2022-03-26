import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Logform } from 'winston';
import {
  createLogger,
  format,
  Logger as WinstonLogger,
  transports,
} from 'winston';

import { AppEnvironment } from '../config/config.constants';
import { Level } from './logging.constants';

@Injectable()
export class Logger {
  private winstonLogger: WinstonLogger;

  constructor(private config: ConfigService) {
    const env = config.get('env');
    const isDev = env === AppEnvironment.DEV;

    this.winstonLogger = createLogger({
      format: format.combine(
        format.timestamp(),
        ...(isDev
          ? [format.prettyPrint({ colorize: true, depth: 3 })]
          : [format.json()]),
      ),
      level: Level.info,
      silent: [AppEnvironment.DEV, AppEnvironment.TEST].includes(env),
      transports: [new transports.Console({})],
    });
  }

  log(
    level: Level,
    message: string,
    infoObj: Omit<Logform.TransformableInfo, 'message'>,
  ) {
    this.winstonLogger.log(level, message, infoObj);
  }
}
