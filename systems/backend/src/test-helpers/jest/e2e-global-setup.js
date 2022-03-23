/* eslint-disable no-console */
('use strict');

const typeorm = require('typeorm');

const dotenv = require('dotenv');

const { createConnection } = typeorm;

dotenv.config({ path: '.env.test' });

module.exports = async function globalSetup() {
  const conn = await createConnection({
    type: 'postgres',
    url: process.env['DATABASE_CONNECTION_URL'],
  });
  const records = await conn.query(`SELECT schema_name
FROM information_schema.schemata
WHERE "schema_name" LIKE 'e2e_%';`);
  const schemaNames = records.map((record) => record.schema_name);
  await Promise.all(
    schemaNames
      .map((schemaName) => `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`)
      .map((statement) => conn.query(statement)),
  );
  await conn.close();
};
