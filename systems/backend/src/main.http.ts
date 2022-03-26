import { ConfigService } from '@nestjs/config';

import { bootstrap } from './bootstrap';

async function start() {
  const app = await bootstrap();
  const config = app.get(ConfigService);
  const port = config.get<number>('port')!;
  return app.listen(port);
}

start().catch(() => {
  process.exit(1);
});
