import { ArgsType, Field, ID, Int } from '@nestjs/graphql';
import { IsOptional, Max, Min } from 'class-validator';

@ArgsType()
export class GetGameListArgs {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  platform?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  userId?: string;

  @Field(() => Int)
  @Min(0)
  @IsOptional()
  offset = 0;

  @Field(() => Int)
  @Min(0)
  @Max(100)
  @IsOptional()
  limit = 10;
}
