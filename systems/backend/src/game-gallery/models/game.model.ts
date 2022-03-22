import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Game {
  @Field(() => ID)
  id!: string;

  @Field()
  numberOfPlayers!: number;

  @Field()
  platform!: string;

  @Field()
  publisher!: string;

  @Field()
  name!: string;

  @Field()
  genre!: string;

  @Field()
  releaseDate!: Date;

  @Field({
    nullable: true,
  })
  boxArtImageUrl?: string;

  @Field()
  updatedAt!: Date;

  @Field()
  createdAt!: Date;
}
