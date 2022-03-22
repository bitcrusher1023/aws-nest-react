import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadedResult {
  @Field(() => ID)
  id!: string;

  @Field()
  url!: string;
}
