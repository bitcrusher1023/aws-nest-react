import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameResolver } from './game.resolver';
import { GameService } from './game.service';
import { GameEntity } from './models/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity])],
  providers: [GameService, GameResolver],
})
export class GameGalleryModule {}
