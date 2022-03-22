import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, ILike, Repository } from 'typeorm';

import type { AddGameToLibraryArgs } from './dto/add-game-to-library.args';
import type { GetGameListArgs } from './dto/get-game-list.args';
import { GameEntity } from './models/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
  ) {}

  uploadBoxArtImage() {}

  fineGamesList(args: GetGameListArgs) {
    const { genre, name, userId } = args;
    const where = [];
    if (genre) where.push(['genre', ILike(`%${genre}%`)]);
    if (name) where.push(['name', ILike(`%${name}%`)]);
    if (userId) where.push(['userId', userId]);
    return this.gameRepository.find({
      where: Object.fromEntries(where),
    });
  }

  fineGame(id: string) {
    return this.gameRepository.findOneOrFail({ id });
  }

  async createGame(userId: string, args: AddGameToLibraryArgs) {
    const [createdGame] = await this.gameRepository.save([
      {
        userId,
        ...args,
      },
    ]);
    return createdGame;
  }
}
