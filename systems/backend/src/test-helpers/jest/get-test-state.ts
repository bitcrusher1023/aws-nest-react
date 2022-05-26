import { expect } from '@jest/globals';

export function getTestName() {
  return (
    expect.getState()?.currentTestName?.toLowerCase().split(' ').join('-') ??
    'n/a'
  );
}

export function getTestPath() {
  return expect.getState().testPath ?? 'n/a';
}
