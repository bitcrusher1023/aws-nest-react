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
import type { GameList } from './models/game.model';

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
    const key = `/upload/box-art/${id}-${filename}`;
    const bucket = this.config.get('s3.asset.bucket');
    await s3.send(
      new PutObjectCommand({
        ACL: 'public-read',
        Body: fileStream,
        Bucket: bucket,
        Key: key,
      }),
    );
    return { id, url: `http://localhost:4566/${bucket}/${key}` };
  }

  async fineGamesList(args: GetGameListArgs): Promise<GameList> {
    const { name, platform, userId } = args;
    const where = [];
    if (platform) where.push(['platform', platform]);
    if (name) where.push(['name', ILike(`%${name}%`)]);
    if (userId) where.push(['userId', userId]);
    const [records, totalCount] = await this.gameRepository.findAndCount({
      order: { id: 'DESC' },
      skip: args.offset,
      take: args.limit,
      where: Object.fromEntries(where),
    });
    const recordLength = records.length;
    return {
      edges: records.map(record => ({
        node: record,
      })),
      pageInfo: {
        hasNextPage: args.offset + recordLength < totalCount,
      },
      totalCount,
    };
  }

  fineGame(id: string) {
    return this.gameRepository.findOneOrFail({ id });
  }

  async createGame(args: AddGameToLibraryArgs) {
    const [createdGame] = await this.gameRepository.save([args]);
    return createdGame;
  }
}
