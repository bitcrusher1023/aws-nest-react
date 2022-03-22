import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'ClientCredentialsGrant',
) {
  constructor(config: ConfigService) {
    const env = config.get('env');
    const shouldFakeAuth = ['test'].includes(env);
    const jwtConfig = {
      audience: config.get('oidp.audience'),
      ignoreExpiration: false,
      issuer: `${config.get('oidp.domain')}/`,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };
    super(
      shouldFakeAuth
        ? { ...jwtConfig, secretOrKey: 'fake-key' }
        : {
            ...jwtConfig,
            secretOrKeyProvider: passportJwtSecret({
              cache: true,
              jwksRequestsPerMinute: 5,
              jwksUri: `${config.get('oidp.domain')}/.well-known/jwks.json`,
              rateLimit: true,
            }),
          },
    );
    const logger = new Logger(JwtStrategy.name);
    if (shouldFakeAuth) logger.log({ message: 'Using fake auth' });
  }

  async validate() {
    return {};
  }
}
