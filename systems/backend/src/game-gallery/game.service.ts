import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import type { ReadStream } from 'fs';
import { ILike, Repository } from 'typeorm';

import type { AddGameToLibraryArgs } from './dto/add-game-to-library.args';
import type { GetGameListArgs } from './dto/get-game-list.args';
import { GameEntity } from './models/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
    private config: ConfigService,
  ) {}

  async uploadBoxArt(filename: string, fileStream: ReadStream) {
    const env = this.config.get('env');
    const id = randomUUID();
    const s3 = new S3Client({
      region: this.config.get('s3.region'),
      ...(['test', 'development'].includes(env)
        ? {
            endpoint: 'http://localhost:4566',
            forcePathStyle: true,
          }
        : {}),
    });
    const key = `box-art/${id}-${filename}`;
    await s3.send(
      new PutObjectCommand({
        ACL: 'public-read',
        Body: fileStream,
        Bucket: this.config.get('s3.asset.bucket'),
        Key: key,
      }),
    );
    return { id, url: key };
  }

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
