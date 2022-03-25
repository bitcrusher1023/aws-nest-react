import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DbOperationLogger } from './db-operation-logger';
import { Logger } from './logger';
import { NestLogger } from './nest-logger';

@Module({
  exports: [DbOperationLogger, NestLogger, Logger],
  imports: [ConfigModule],
  providers: [Logger, DbOperationLogger, NestLogger],
})
export class LoggingModule {}
