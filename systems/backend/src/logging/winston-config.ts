import { format, LoggerOptions, transports } from 'winston';

import { AppEnvironment } from '../config/config.constants';
import { Level } from './logging.constants';

const shouldPrettyPrintLog =
  process.env['NODE_ENV'] === AppEnvironment.DEV ||
  process.env['DEBUG'] !== undefined;

export const WinstonConfig: LoggerOptions = {
  format: format.combine(
    format.timestamp(),
    ...(shouldPrettyPrintLog
      ? [format.prettyPrint({ colorize: true, depth: 3 })]
      : [format.json()]),
  ),
  level: Level.info,
  transports: [new transports.Console({})],
};
