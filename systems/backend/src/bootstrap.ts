import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { configuration } from './config/configuration';
import { NestLogger } from './logging/nest-logger';

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  return setupApp(app);
}

export function setupApp(app: NestExpressApplication) {
  const config = app.get(ConfigService);
  const frontendOrigin = config.get('frontend.origin');
  const logger = app.get(NestLogger);
  app.enableCors({ credentials: true, origin: [frontendOrigin] });
  app.useLogger(logger);
  app.use(helmet({}));

  app.enableShutdownHooks();

  logger.log({
    config: configuration(),
    level: 'info',
    message: 'Starting server',
  });
  return app;
}
