import { describe, expect, it } from '@jest/globals';

import { createRequestAgent } from '../test-helpers/create-request-agent';
import { expectResponseCode } from '../test-helpers/expect-response-code';
import { withNestServerContext } from '../test-helpers/nest-app-context';

const appContext = withNestServerContext({
  imports: [],
});

describe('Frontend Module', () => {
  it.each([['/'], ['/random']])('should match all route %s', async route => {
    const app = appContext.app;
    const resp = await createRequestAgent(app.getHttpServer())
      .get(route)
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(resp.text).toContain('app-root');
  });
});
