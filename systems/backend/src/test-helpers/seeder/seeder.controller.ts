import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { SeederService } from './seeder.service';

@Controller('/test/seeder/game')
export class SeederController {
  constructor(private seederService: SeederService) {}

  @Get('/:id')
  async fineOne(@Param('id') id: string) {
    return { data: await this.seederService.fineOne(id) };
  }

  @Get('/')
  async fineMany(@Query() query: any) {
    return { data: { items: await this.seederService.fineMany(query) } };
  }

  @Post('/')
  async create(@Body() payload: any) {
    return { data: await this.seederService.create(payload) };
  }
}
