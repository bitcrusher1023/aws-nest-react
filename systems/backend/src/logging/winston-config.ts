import { format, LoggerOptions, transports } from 'winston';

import { Level } from './logging.constants';

const shouldPrettyPrintLog =
  process.env['NODE_ENV'] === 'development' ||
  process.env['DEBUG'] !== undefined;

export const WinstonConfig: LoggerOptions = {
  format: format.combine(
    format.timestamp(),
    ...(shouldPrettyPrintLog
      ? [format.prettyPrint({ colorize: true, depth: 3 })]
      : [format.json()]),
  ),
  level: Level.info,
  silent: process.env['NODE_ENV'] !== 'production',
  transports: [new transports.Console({})],
};
