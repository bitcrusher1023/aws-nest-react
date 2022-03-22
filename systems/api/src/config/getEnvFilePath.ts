export function getEnvFilePath() {
  const nodeEnv = process.env['NODE_ENV'] ?? 'development';
  if (nodeEnv === 'development') {
    return '.env';
  }

  if (nodeEnv === 'test') {
    return '.env.test';
  }

  return '.env';
}
