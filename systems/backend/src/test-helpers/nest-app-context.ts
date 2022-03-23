import { afterAll, beforeAll } from '@jest/globals';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import type { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { graphqlUploadExpress } from 'graphql-upload';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { CommonModule } from '../common/common.module';
import { configuration } from '../config/configuration';
import { getEnvFilePath } from '../config/getEnvFilePath';
import { ErrorCode } from '../error-hanlding/error-code.constant';
import { GameGalleryModule } from '../game-gallery/game-gallery.module';
import { HealthModule } from '../health-check/health.module';
import type { DbOperationLogger } from '../logging/db-operation-logger';
import { LoggingModule } from '../logging/logging.module';
import { NestLogger } from '../logging/nest-logger';
import { SeederModule } from './seeder/seeder.module';

interface AppContext {
  app: INestApplication;
  module: TestingModule;
}

export async function createTestApp(
  moduleMetadata: ModuleMetadata,
): Promise<AppContext> {
  // @ts-expect-error ignore this error
  const { db } = global['e2eConfig'];
  const module = Test.createTestingModule({
    controllers: moduleMetadata.controllers ?? [],
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
      CommonModule,
      GraphQLModule.forRoot<ApolloDriverConfig>({
        autoSchemaFile: 'schema.graphql',
        driver: ApolloDriver,
        sortSchema: true,
      }),
      GameGalleryModule,
      TerminusModule,
      HealthModule,
      SeederModule,
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule, LoggingModule],
        inject: [ConfigService],
        async useFactory(
          configService: ConfigService,
          logger: DbOperationLogger,
        ) {
          const { connectionURL, type } = configService.get('database');
          return {
            autoLoadEntities: true,
            logger,
            migrations: ['dist/migrations/*.js'],
            migrationsRun: true,
            namingStrategy: new SnakeNamingStrategy(),
            schema: db.schema,
            type,
            url: connectionURL,
          };
        },
      }),
      ...(moduleMetadata.imports ?? []),
    ],

    providers: moduleMetadata.providers ?? [],
  });
  const moduleRef = await module.compile();
  const app = moduleRef.createNestApplication();
  app.use(graphqlUploadExpress());
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
