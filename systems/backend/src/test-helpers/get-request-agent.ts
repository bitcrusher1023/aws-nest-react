import type { INestApplication } from '@nestjs/common';
import type { SuperAgentTest } from 'supertest';
import * as request from 'supertest';

import { getTestName, getTestPath } from './jest/get-test-state';

export function getRequestAgent(app: INestApplication) {
  return request.agent(app).set({
    'X-Test-Name': encodeURI(getTestName()),
    'X-Test-Path': encodeURI(getTestPath()),
  }) as unknown as SuperAgentTest;
}
