import { Module } from '@nestjs/common';

import { DateScalar } from './date.scalr';

@Module({
  providers: [DateScalar],
})
export class CommonModule {}
