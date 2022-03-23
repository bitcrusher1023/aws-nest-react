import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

@InputType()
export class AddGameToLibraryArgs {
  @Field({ nullable: false })
  @IsNotEmpty()
  userId!: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  name!: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  numberOfPlayers!: number;

  @Field({ nullable: false })
  @IsNotEmpty()
  platform!: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  publisher!: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  genre!: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  releaseDate!: Date;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  boxArtImageUrl?: string;
}
