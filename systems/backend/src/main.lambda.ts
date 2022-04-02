import serverlessExpress from '@vendia/serverless-express';
import type { Callback, Context, Handler } from 'aws-lambda';

import { bootstrap } from './bootstrap';

let server: Handler;

async function createServerlessExpress() {
  const app = await bootstrap();
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export async function handler(
  event: any,
  context: Context,
  callback: Callback,
) {
  server = server ?? (await createServerlessExpress());
  return server(event, context, callback);
}
