import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetGameArgs {
  @Field(() => ID)
  @IsNotEmpty()
  id!: string;
}
