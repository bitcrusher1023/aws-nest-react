import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppEnvironment } from '../../config/config.constants';
import { GameEntity } from '../../game-gallery/models/game.entity';
import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';

@Module({})
export class SeederModule {
  public static forRoot(): DynamicModule {
    const shouldExposeRoute = [
      AppEnvironment.TEST,
      AppEnvironment.DEV,
    ].includes(process.env['NODE_ENV']! as AppEnvironment);
    return {
      controllers: shouldExposeRoute ? [SeederController] : [],
      imports: [TypeOrmModule.forFeature([GameEntity]), ConfigModule],
      module: SeederModule,
      providers: [SeederService],
    };
  }
}
