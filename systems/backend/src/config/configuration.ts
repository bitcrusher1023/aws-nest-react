import convict from 'convict';

import { AppEnvironment, AppMode } from './config.constants';

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
    env: 'APP_ENV',
    format: Object.values(AppEnvironment),
  },
  frontend: {
    origin: {
      default: null,
      format: String,
    },
  },
  mode: {
    default: 'http',
    env: 'APP_MODE',
    format: Object.values(AppMode),
  },
  port: {
    default: 5333,
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
      cloudfront: {
        default: null,
        env: 'CLOUDFRONT_URL',
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
  const isPrd = configSchema.get('env') === AppEnvironment.PRD;
  configSchema.load({
    frontend: {
      origin: isPrd
        ? configSchema.get('s3.asset.cloudfront')
        : 'http://localhost:3000',
    },
  });
  configSchema.validate({
    allowed: 'strict',
  });

  return configSchema.getProperties();
}
