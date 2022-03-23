import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppEnvironment } from '../config/config.constants';
import { DbOperationLogger } from '../logging/db-operation-logger';
import { LoggingModule } from '../logging/logging.module';

@Module({})
export class DatabaseModule {
  static forRoot() {
    return TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggingModule],
      inject: [ConfigService, DbOperationLogger],
      async useFactory(configService: ConfigService) {
        // @ts-expect-error value will injected in jest test-helpers
        const { db } = global['e2eConfig'] ?? {};
        const isTest = [AppEnvironment.TEST].includes(
          configService.get('env')!,
        );
        const { connectionURL, type } = configService.get('database');
        return {
          autoLoadEntities: true,
          migrations: ['dist/migrations/*'],
          migrationsRun: true,
          namingStrategy: new SnakeNamingStrategy() as any,
          type,
          url: connectionURL,
          ...(isTest && db?.schema
            ? {
                schema: db.schema,
              }
            : {}),
        };
      },
    });
  }
}
