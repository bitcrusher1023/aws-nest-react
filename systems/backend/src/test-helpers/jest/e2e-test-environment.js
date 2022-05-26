const { TestEnvironment } = require('jest-environment-node');
const path = require('path');
const typeorm = require('typeorm');

const dotenv = require('dotenv');

const { createConnection } = typeorm;

dotenv.config({ path: '.env.test' });

function generateTestId(testPath) {
  const { dir, name } = path.parse(path.relative(process.cwd(), testPath));

  const suffix = `e2e-${path
    .join(dir, name.replace(/\.(e2e-spec|spec)$/, ''))
    .replace(/[/\\. "$]+/g, '-')}`;

  // https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS
  const maxLength = 63;
  if (suffix.length >= maxLength) {
    return `e2e-${suffix
      .slice(-maxLength)
      .replace(/^./, '-')
      .toLowerCase()
      .split('-')
      .filter(i => i.length > 0)
      .join('-')}`;
  }
  return suffix.toLowerCase();
}

async function setupDB(testId) {
  const conn = await createConnection({
    type: 'postgres',
    url: process.env['DATABASE_CONNECTION_URL'],
  });
  await conn.query(`CREATE SCHEMA IF NOT EXISTS "${testId}"`);
  await conn.close();
  return testId;
}

class E2ETestEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context['testPath'];
  }

  async setup() {
    await super.setup();
    const testId = generateTestId(this.testPath);
    this.global['testConfig'] = {
      db: {
        schema: await setupDB(testId),
      },
      testId,
    };
  }

  async teardown() {
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = E2ETestEnvironment;
