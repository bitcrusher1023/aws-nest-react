require('dotenv').config();

module.exports = {
  cli: {
    migrationsDir: 'src/migrations',
  },
  migrations: ['dist/migrations/*.js'],
  type: 'postgres',
  url: process.env.DATABASE_CONNECTION_URL,
};
