import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Logger } from './logger';
import { NestLogger } from './nest-logger';

@Module({
  exports: [NestLogger, Logger],
  imports: [ConfigModule],
  providers: [Logger, NestLogger],
})
export class LoggingModule {}
