import type { MigrationInterface, QueryRunner } from 'typeorm';

export class createApplication1624370511078 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('application')
      .values([
        {
          client_secret_key: ['f01ce398-93d6-42ad-800c-9a744738d84d'],
          name: 'template',
          origins: ['http://localhost:3000'],
          server_secret_key: ['0a609751-9361-4624-a33d-2cd65e88d0a8'],
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('application')
      .where({
        name: 'template',
      })
      .execute();
  }
}
