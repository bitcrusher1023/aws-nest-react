import { Module } from '@nestjs/common';

import { DbOperationLogger } from './db-operation-logger';
import { Logger } from './logger';
import { NestLogger } from './nest-logger';

@Module({
  exports: [DbOperationLogger, NestLogger, Logger],
  providers: [Logger, DbOperationLogger, NestLogger],
})
export class LoggingModule {}
