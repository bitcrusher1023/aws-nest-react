import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class GetGameListArgs {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  genre?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  userId?: string;
}
