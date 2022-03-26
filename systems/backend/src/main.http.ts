import { ConfigService } from '@nestjs/config';
import { serializeError } from 'serialize-error';

import { bootstrap } from './bootstrap';

async function start() {
  const app = await bootstrap();
  const config = app.get(ConfigService);
  const port = config.get<number>('port')!;
  return app.listen(port);
}

start().catch(e => {
  // eslint-disable-next-line no-console
  console.error(serializeError(e));
  process.exit(1);
});
