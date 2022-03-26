/* eslint-disable import/no-unresolved */

import pg from 'pg';

const { Client } = pg;
export function handler(event, _, callback) {
  const client = new Client({
    connectionString: process.env.DATABASE_CONNECTION_URL,
  });
  client.connect();
  client.query('SELECT NOW()', (err, res) => {
    client.end();
    if (err) return callback(err);
    return callback(null, { env: process.env, now: res.rows[0] });
  });
}
