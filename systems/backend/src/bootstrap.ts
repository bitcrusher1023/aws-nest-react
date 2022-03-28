import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { configuration } from './config/configuration';
import { BadRequestException } from './error-hanlding/bad-request.exception';
import { ErrorCode } from './error-hanlding/error-code.constant';
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
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

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
      whitelist: false,
    }),
  );

  app.enableShutdownHooks();

  logger.log({
    config: configuration(),
    level: 'info',
    message: 'Starting server',
  });
  return app;
}
