import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import path from 'path';

import { AppModule } from './app.module';
import { BadRequestException } from './error-hanlding/bad-request.exception';
import { ErrorCode } from './error-hanlding/error-code.constant';
import { NONCE } from './frontend/frontend.constants';
import { NestLogger } from './logging/nest-logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const config = app.get(ConfigService);
  const isDevelop = config.get('env') === 'development';
  const port = config.get<number>('port')!;
  const logger = app.get(NestLogger);

  app.useLogger(logger);
  // TODO: Anti pattern for disable / allow on header
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'connect-src': '*',
          'default-src': ['strict-dynamic', `'nonce-${app.get(NONCE)}'`],
          'img-src': '*',
          'script-src': null,
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  );
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
  if (isDevelop)
    app.useStaticAssets(path.join(__dirname, '..', '..', 'frontend'));
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.enableShutdownHooks();

  await app.listen(port);
}
bootstrap();
