import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { randomBytes } from 'crypto';

import { NONCE } from './frontend.constants';
import { FrontendController } from './frontend.controller';

@Module({
  controllers: [FrontendController],
})
export class FrontendModule {
  public static forRoot(): DynamicModule {
    return {
      exports: [NONCE],
      imports: [ConfigModule],
      module: FrontendModule,
      providers: [
        {
          provide: NONCE,
          useValue: randomBytes(16).toString('base64'),
        },
      ],
    };
  }
}
