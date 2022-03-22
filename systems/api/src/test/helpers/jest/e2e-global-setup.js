/* eslint-disable no-console */

'use strict';

import dotenv from 'dotenv';
import typeorm from 'typeorm';

const { createConnection } = typeorm;

dotenv.config({ path: '.env.test' });

// eslint-disable-next-line import/no-default-export
export default async function globalSetup() {
  const conn = await createConnection({
    logging: true,
    type: 'postgres',
    url: process.env['DATABASE_CONNECTION_URL'],
  });
  const records = await conn.query(`SELECT schema_name
FROM information_schema.schemata
WHERE "schema_name" LIKE 'e2e_%';`);
  const schemaNames = records.map(record => record.schema_name);
  await Promise.all(
    schemaNames
      .map(schemaName => `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`)
      .map(statement => conn.query(statement)),
  );
  await conn.close();
}
