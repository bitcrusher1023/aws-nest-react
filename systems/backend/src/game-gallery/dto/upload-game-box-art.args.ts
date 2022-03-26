import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class UploadGameBoxArtArgs {
  @Field()
  fileName!: string;
}
