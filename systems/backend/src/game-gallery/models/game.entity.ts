import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'game' })
export class GameEntity {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column()
  platform!: string;

  @Column()
  publisher!: string;

  @Column()
  numberOfPlayers!: number;

  @Column()
  userId!: string;

  @Column()
  name!: string;

  @Column()
  genre!: string;

  @Column({ type: 'timestamp without time zone' })
  releaseDate!: Date;

  @Column({
    nullable: true,
  })
  boxArtImageUrl?: string;

  @UpdateDateColumn()
  declare updatedAt: Date;

  @CreateDateColumn()
  declare createdAt: Date;
}
