import { Module } from '@nestjs/common';

import { DateScalar } from './date.sclar';

@Module({
  providers: [DateScalar],
})
export class CommonModule {}
