import { AppEnvironment } from './config.constants';

export function getEnvFilePath() {
  const nodeEnv = process.env['APP_ENV'] ?? AppEnvironment.DEV;
  if (nodeEnv === AppEnvironment.DEV) {
    return '.env.development';
  }

  if (nodeEnv === AppEnvironment.TEST) {
    return '.env.test';
  }

  return '.env';
}
