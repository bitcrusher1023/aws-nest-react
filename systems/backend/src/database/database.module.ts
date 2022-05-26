import { Injectable, Module, Optional } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppEnvironment } from '../config/config.constants';
import { JestTestStateProvider } from '../test-helpers/jest/jest-test-state.provider';

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private config: ConfigService,
    @Optional() private testState?: JestTestStateProvider,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { db } = this.testState?.testConfig;
    const isTest = [AppEnvironment.TEST].includes(this.config.get('env')!);
    const { connectionURL, type } = this.config.get('database');
    return {
      autoLoadEntities: true,
      migrations: ['dist/migrations/*'],
      migrationsRun: true,
      namingStrategy: new SnakeNamingStrategy() as any,
      type,
      url: connectionURL,
      ...(isTest && db?.schema
        ? {
            schema: db.schema,
          }
        : {}),
    };
  }
}

@Module({})
export class DatabaseModule {
  static forRoot() {
    return TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    });
  }
}
