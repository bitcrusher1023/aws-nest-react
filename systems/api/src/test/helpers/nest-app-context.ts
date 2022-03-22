import { configuration } from '@api/config/configuration';
import { getEnvFilePath } from '@api/config/getEnvFilePath';
import { GeneralExceptionFilter } from '@api/exception-filters/general-exception.filter';
import { BadRequestException } from '@api/exceptions/BadRequestException';
import { ErrorCode } from '@api/exceptions/ErrorCode';
import { LoggingInterceptor } from '@api/interceptors/logging.interceptor';
import { AuthModule } from '@api/modules/auth/auth.module';
import { DbOperationLogger } from '@api/modules/logger/db-operation-logger';
import { LoggingModule } from '@api/modules/logger/logging.module';
import { NestLogger } from '@api/modules/logger/nest-logger';
import { afterAll, beforeAll } from '@jest/globals';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import type { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

interface AppContext {
  app: INestApplication;
  module: TestingModule;
}

export async function createTestApp(
  moduleMetadata: ModuleMetadata,
): Promise<AppContext> {
  const { db } = global['e2eConfig'];
  const module = Test.createTestingModule({
    controllers: [...(moduleMetadata.controllers ?? [])],
    imports: [
      ConfigModule.forRoot({
        envFilePath: getEnvFilePath(),
        load: [configuration],
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
            logger,
            logging: true,
            migrations: ['cjs-dist/migrations/*.cjs'],
            migrationsRun: true,
            namingStrategy: new SnakeNamingStrategy() as any,
            schema: db.schema,
            type,
            url: connectionURL,
          };
        },
      }),
      AuthModule,
      ...(moduleMetadata.imports ?? []),
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
      ...(moduleMetadata.providers ?? []),
    ],
  });
  const moduleRef = await module.compile();
  const app = moduleRef.createNestApplication();
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      groups: ['e2e-test'],
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors) {
        throw new BadRequestException({
          code: ErrorCode.ValidationError,
          errors: errors.map(error => error.toString()),
          meta: { errors },
        });
      },
      transform: true,
      whitelist: true,
    }),
  );
  app.useLogger(app.get(NestLogger));
  return {
    app,
    module: moduleRef,
  };
}

export async function createTestServer(moduleMetadata: ModuleMetadata) {
  const { app, module } = await createTestApp(moduleMetadata);
  const config = app.get(ConfigService);

  const port =
    config.get('port') + parseInt(process.env['JEST_WORKER_ID']!, 10);
  // https://jestjs.io/docs/en/environment-variables
  await app.listen(port);
  return {
    app,
    module: module,
  };
}

export function withNestServerContext(
  moduleMetadata: ModuleMetadata,
): AppContext {
  // @ts-expect-error context need assign on beforeAll hooks and must available
  const context: AppContext = {};
  beforeAll(async () => {
    const { app, module } = await createTestServer(moduleMetadata);
    Object.assign(context, { app, module });
  });
  afterAll(async () => {
    await context?.app?.close();
  });
  return context;
}
