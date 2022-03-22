const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

require('dotenv').config();

const env = process.env.NODE_ENV;

const config = {
  cli: {
    migrationsDir: `src/seeds/${env}`,
  },
  migrations: [`dist/cjs/seeds/${env}/*.cjs`],
  migrationsTableName: 'seeds',
  namingStrategy: new SnakeNamingStrategy(),
  type: 'postgres',
  url: process.env.DATABASE_CONNECTION_URL,
};

module.exports = config;
