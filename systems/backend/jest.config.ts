import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.spec.ts',
    '!<rootDir>/src/migrations/*.ts',
  ],
  coverageDirectory: '<rootDir>/../coverage',
  globalSetup: '<rootDir>/test-helpers/jest/e2e-global-setup.js',
  injectGlobals: false,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testEnvironment: '<rootDir>/test-helpers/jest/e2e-test-environment.js',

  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
