import { AppEnvironment } from './config.constants';

export function getEnvFilePath() {
  const nodeEnv = process.env['NODE_ENV'] ?? AppEnvironment.DEV;
  if (nodeEnv === AppEnvironment.DEV) {
    return '.env';
  }

  if (nodeEnv === AppEnvironment.TEST) {
    return '.env.test';
  }

  return '.env';
}
