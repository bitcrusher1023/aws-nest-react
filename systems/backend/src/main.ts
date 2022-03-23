import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { BadRequestException } from './error-hanlding/bad-request.exception';
import { ErrorCode } from './error-hanlding/error-code.constant';
import { Logger } from './logging/logger';
import { NestLogger } from './logging/nest-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new NestLogger(new Logger()),
  });

  app.use(helmet());

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
  const config = app.get(ConfigService);
  const logger = app.get(NestLogger);
  app.useLogger(logger);
  await app.listen(config.get<number>('port')!);
}
bootstrap();
