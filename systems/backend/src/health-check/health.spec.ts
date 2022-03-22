import { describe, expect, it } from '@jest/globals';
import { TerminusModule } from '@nestjs/terminus';

import { createRequestAgent } from '../test-helpers/create-request-agent';
import { expectResponseCode } from '../test-helpers/expect-response-code';
import { withNestServerContext } from '../test-helpers/nest-app-context';
import { HealthModule } from './health.module';

const appContext = withNestServerContext({
  imports: [TerminusModule, HealthModule],
});
describe('GET /healthz', () => {
  it('/healthz (GET)', async () => {
    const app = appContext.app;
    const { body } = await createRequestAgent(app.getHttpServer())
      .get('/healthz')
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(body).toStrictEqual({
      details: {
        database: {
          status: 'up',
        },
      },
      error: {},
      info: {
        database: {
          status: 'up',
        },
      },
      status: 'ok',
    });
  });
});
