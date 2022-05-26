import { Module } from '@nestjs/common';

import { JestTestStateProvider } from './jest-test-state.provider';

@Module({})
export class JestModule {
  static forRoot() {
    return {
      exports: [JestTestStateProvider],
      global: true,
      imports: [],
      module: JestModule,
      providers: [JestTestStateProvider],
    };
  }
}
