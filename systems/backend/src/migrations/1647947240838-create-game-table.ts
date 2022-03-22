import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createGameTable1647947240838 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        columns: [
          {
            default: 'uuid_generate_v4()',
            isPrimary: true,
            name: 'id',
            type: 'uuid',
          },
          {
            isNullable: false,
            name: 'platform',
            type: 'CHAR(32)',
          },
          {
            isNullable: false,
            name: 'publisher',
            type: 'CHAR(128)',
          },
          {
            isNullable: false,
            name: 'number_of_players',
            type: 'smallint',
          },
          {
            isNullable: false,
            name: 'user_id',
            type: 'uuid',
          },
          {
            isNullable: false,
            name: 'name',
            type: 'VARCHAR',
          },
          {
            isNullable: false,
            name: 'genre',
            type: 'CHAR(128)',
          },
          {
            isNullable: false,
            name: 'release_date',
            type: 'TIMESTAMP WITHOUT TIME ZONE',
          },
          {
            isNullable: true,
            name: 'box_art_image_url',
            type: 'TEXT',
          },
          {
            default: 'NOW()',
            isNullable: false,
            name: 'updated_at',
            type: 'TIMESTAMP',
          },
          {
            default: 'NOW()',
            isNullable: false,
            name: 'created_at',
            type: 'TIMESTAMP',
          },
        ],
        name: 'game',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(new Table({ name: 'game' }));
  }
}
