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
  port: {
    default: null,
    env: 'PORT',
    format: 'port',
  },

  s3: {
    asset: {
      bucket: {
        default: null,
        env: 'S3_ASSET_BUCKET',
        format: String,
      },
    },
    region: {
      default: null,
      env: 'S3_REGION',
      format: String,
    },
  },
});

export function configuration() {
  configSchema.load({});
  configSchema.validate({
    allowed: 'strict',
  });

  return configSchema.getProperties();
}
