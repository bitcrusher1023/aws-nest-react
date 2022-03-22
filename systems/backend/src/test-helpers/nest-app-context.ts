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

import { configuration } from '../config/configuration';
import { getEnvFilePath } from '../config/getEnvFilePath';
import { BadRequestException } from '../error-hanlding/bad-request.exception';
import { ErrorCode } from '../error-hanlding/error-code.constant';
import { GeneralExceptionFilter } from '../error-hanlding/general-exception.filter';
import { DbOperationLogger } from '../logging/db-operation-logger';
import { LoggingInterceptor } from '../logging/logging.interceptor';
import { LoggingModule } from '../logging/logging.module';
import { NestLogger } from '../logging/nest-logger';

interface AppContext {
  app: INestApplication;
  module: TestingModule;
}

export async function createTestApp(
  moduleMetadata: ModuleMetadata,
): Promise<AppContext> {
  // @ts-expect-error ignore typing error here
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
          errors: errors.map((error) => error.toString()),
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
