import convict from 'convict';

convict.addFormat({
  coerce(val: any): any {
    return val.split(',');
  },
  name: 'comma-separated-value',
  validate(sources) {
    return Array.isArray(sources) && sources.length > 0;
  },
});

const configSchema = convict({
  database: {
    connectionURL: {
      default: null,
      env: 'DATABASE_CONNECTION_URL',
      format: String,
    },
    type: {
      default: 'postgres',
      format: String,
    },
  },
  env: {
    default: 'development',
    env: 'NODE_ENV',
    format: ['test', 'development', 'production'],
  },
  oidp: {
    audience: {
      default: null,
      env: 'OIDP_AUDIENCE',
      format: String,
    },
    domain: {
      default: null,
      env: 'OIDP_DOMAIN',
      format: String,
    },
  },
  port: {
    default: null,
    env: 'PORT',
    format: 'port',
  },
});

export function configuration() {
  configSchema.load({});
  configSchema.validate({
    allowed: 'strict',
  });

  return configSchema.getProperties();
}
