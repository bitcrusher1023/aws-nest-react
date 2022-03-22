import type { Config } from '@jest/types';

// @ts-expect-error JS file no type defined
import { imports } from './import-map.cjs';

const { api, apiTestHelper } = {
  api: imports['/@api/'].jest,
  apiTestHelper: imports['/@api-test-helpers/'].jest,
};
const config: Config.InitialOptions = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.spec.ts',
    '!<rootDir>/src/migrations/*.ts',
    '!<rootDir>/src/seeds/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  extensionsToTreatAsEsm: ['.ts'],
  globalSetup: '<rootDir>/src/test/helpers/jest/e2e-global-setup.js',
  injectGlobals: false,
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    [api.key]: api.value,
    [apiTestHelper.key]: apiTestHelper.value,
  },

  rootDir: '.',

  testEnvironment: '<rootDir>/src/test/helpers/jest/e2e-test-environment.js',

  testRegex: '.*.spec.ts$',

  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
