import { afterAll, beforeAll, beforeEach } from '@jest/globals';
import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import type { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';

import { AppModule } from '../app.module';
import { NestLogger } from '../logging/nest-logger';

interface NestServerContext {
  app: INestApplication;
}

interface NestModuleBuilderContext {
  moduleBuilder: TestingModuleBuilder;
}

function createTestingModuleBuilder(
  moduleMetadata: ModuleMetadata,
): TestingModuleBuilder {
  return Test.createTestingModule({
    controllers: moduleMetadata.controllers ?? [],
    imports: [AppModule, ...(moduleMetadata.imports ?? [])],
    providers: moduleMetadata.providers ?? [],
  });
}

async function createTestingApp(
  module: TestingModule,
): Promise<NestExpressApplication> {
  const app = module.createNestApplication<NestExpressApplication>();

  app.setViewEngine('hbs');
  app.enableShutdownHooks();
  const logger = app.get(NestLogger);

  app.useLogger(logger);
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      groups: ['e2e-test'],
    }),
  );

  return app;
}

async function createTestingServer(
  moduleMetadata: ModuleMetadata,
): Promise<NestServerContext> {
  const moduleBuilder = createTestingModuleBuilder(moduleMetadata);
  const module = await moduleBuilder.compile();
  const app = await createTestingApp(module);
  const config = app.get(ConfigService);
  const port =
    config.get('port') + parseInt(process.env['JEST_WORKER_ID']!, 10);
  // https://jestjs.io/docs/en/environment-variables
  await app.listen(port);
  return {
    app,
  };
}

export function withNestServerContext(
  moduleMetadata: ModuleMetadata,
): NestServerContext {
  // @ts-expect-error context need assign on beforeAll hooks and must available
  const context: AppContext = {};
  beforeAll(async () => {
    const { app } = await createTestingServer(moduleMetadata);
    Object.assign(context, { app });
  });
  afterAll(async () => {
    await context?.app?.close();
  });
  return context;
}

export function withNestModuleBuilderContext(
  moduleMetadata: ModuleMetadata,
): NestModuleBuilderContext {
  // @ts-expect-error context need assign on beforeAll hooks and must available
  const context: NestModuleBuilderContext = {};
  beforeEach(async () => {
    const moduleBuilder = await createTestingModuleBuilder(moduleMetadata);
    Object.assign(context, { moduleBuilder });
  });
  return context;
}
