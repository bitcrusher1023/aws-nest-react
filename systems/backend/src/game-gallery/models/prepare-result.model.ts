import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PrepareUpload {
  @Field(() => ID)
  id!: string;

  @Field()
  resultPublicUrl!: string;

  @Field()
  uploadUrl!: string;
}
