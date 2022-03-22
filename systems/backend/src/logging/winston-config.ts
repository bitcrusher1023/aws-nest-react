import { format, LoggerOptions, transports } from 'winston';
import type Transport from 'winston-transport';

import { Level } from './logging.constants';

const shouldPrettyPrintLog =
  process.env['NODE_ENV'] === 'development' ||
  process.env['DEBUG'] !== undefined;

const logTransports: {
  [key: string]: any[];
  default: Transport[];
} = {
  default: [new transports.Console({})],
  test: [
    new transports.File({
      filename: '.test-app.log',
      options: {
        flag: 'a',
      },
    }),
  ],
};

const selectedTransports =
  logTransports[process.env['NODE_ENV'] as string] ?? logTransports.default;
export const WinstonConfig: LoggerOptions = {
  format: format.combine(
    format.timestamp(),
    ...(shouldPrettyPrintLog
      ? [format.prettyPrint({ colorize: true, depth: 3 })]
      : [format.json()]),
  ),
  level: Level.info,
  transports: selectedTransports,
};
