import { GeneralExceptionFilter } from '@api/exception-filters/general-exception.filter';
import { LoggingInterceptor } from '@api/interceptors/logging.interceptor';
import { AuthModule } from '@api/modules/auth/auth.module';
import { CouponModule } from '@api/modules/coupon/coupon.module';
import { HealthModule } from '@api/modules/health/health.module';
import { DbOperationLogger } from '@api/modules/logger/db-operation-logger';
import { LoggingModule } from '@api/modules/logger/logging.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { configuration } from './config/configuration';
import { getEnvFilePath } from './config/getEnvFilePath';
import { RequestIdMiddleware } from './middlewares/request-id.middleware';
import { RequestStartTimeMiddleware } from './middlewares/request-start-time.middleware';

@Module({
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
    AuthModule,
    TerminusModule,
    HealthModule,
    CouponModule,
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestStartTimeMiddleware, RequestIdMiddleware)
      .forRoutes('*');
  }
}
