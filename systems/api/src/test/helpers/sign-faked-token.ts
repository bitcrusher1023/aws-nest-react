import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import jwt from 'jsonwebtoken';

export function signFakedToken(testingModule: TestingModule) {
  const config = testingModule.get(ConfigService);
  const token = jwt.sign({}, 'fake-key', {
    audience: config.get('oidp.audience'),
    expiresIn: '1d',
    issuer: `${config.get('oidp.domain')}/`,
  });
  return `Bearer ${token}`;
}
