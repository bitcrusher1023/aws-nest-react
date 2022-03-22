import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameEntity } from '../../game-gallery/models/game.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
  ) {}

  async create(data: any) {
    if (data.items) {
      const records = await this.gameRepository.save(data.items);
      return records;
    }
    return await this.gameRepository.save(data);
  }

  async fineMany(conditions: any) {
    const records = await this.gameRepository.find({ where: conditions });
    return records;
  }

  async fineOne(id: string) {
    const record = await this.gameRepository.findOne(id);
    return record;
  }
}
