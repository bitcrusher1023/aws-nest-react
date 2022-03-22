module.exports = {
  cli: {
    migrationsDir: 'src/migrations',
  },
  migrations: ['dist/cjs/migrations/*.cjs'],
  type: 'postgres',
  url: process.env.DATABASE_CONNECTION_URL,
};
