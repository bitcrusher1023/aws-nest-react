import { Logger } from '@api/modules/logger/logger';
import { NestLogger } from '@api/modules/logger/nest-logger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { BadRequestException } from './exceptions/BadRequestException';
import { ErrorCode } from './exceptions/ErrorCode';

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
      whitelist: true,
    }),
  );

  app.enableShutdownHooks();
  const config = app.get(ConfigService);
  const logger = app.get(NestLogger);
  app.useLogger(logger);
  const options = new DocumentBuilder()
    .setTitle('Example API')
    .setDescription('Example API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  await SwaggerModule.setup('/docs', app, document, {});

  await app.listen(config.get<number>('port')!);
}
bootstrap();
