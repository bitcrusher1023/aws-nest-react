import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { configuration } from './config/configuration';
import { getEnvFilePath } from './config/getEnvFilePath';
import { GeneralExceptionFilter } from './error-hanlding/general-exception.filter';
import { HealthModule } from './health-check/health.module';
import { DbOperationLogger } from './logging/db-operation-logger';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { LoggingModule } from './logging/logging.module';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      load: [
        async () => {
          const value = await configuration();
          return value;
        },
      ],
    }),
    LoggingModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggingModule],
      inject: [ConfigService, DbOperationLogger],
      async useFactory(
        configService: ConfigService,
        logger: DbOperationLogger,
      ) {
        const { connectionURL, type } = configService.get('database');
        return {
          autoLoadEntities: true,
          logger: logger,
          migrations: ['dist/migrations/*'],
          migrationsRun: true,
          namingStrategy: new SnakeNamingStrategy() as any,
          type,
          url: connectionURL,
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
    }),
    TerminusModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GeneralExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
