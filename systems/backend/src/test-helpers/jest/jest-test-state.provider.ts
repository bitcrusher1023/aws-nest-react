import { expect } from '@jest/globals';
import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class JestTestStateProvider {
  private logger = new Logger(JestTestStateProvider.name);

  private randomTestId = randomUUID().replace(/-/g, '');

  get testConfig() {
    // @ts-expect-error No type here
    return global['testConfig'] ?? {};
  }

  get testId() {
    return this.randomTestId;
  }

  get testName() {
    return expect
      .getState()
      ?.currentTestName?.toLowerCase()
      .split(' ')
      .join('-');
  }
}
