import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameResolver } from './game.resolver';
import { GameService } from './game.service';
import { GameEntity } from './models/game.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([GameEntity])],
  providers: [GameService, GameResolver],
})
export class GameGalleryModule {}
