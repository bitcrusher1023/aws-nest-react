import { afterAll, beforeAll } from '@jest/globals';
import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import type { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../app.module';

interface AppContext {
  app: INestApplication;
  module: TestingModule;
}

export async function createTestApp(
  moduleMetadata: ModuleMetadata,
): Promise<AppContext> {
  const module = Test.createTestingModule({
    controllers: moduleMetadata.controllers ?? [],
    imports: [AppModule, ...(moduleMetadata.imports ?? [])],
    providers: moduleMetadata.providers ?? [],
  });
  const moduleRef = await module.compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>();

  app.setViewEngine('hbs');
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      groups: ['e2e-test'],
    }),
  );

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
