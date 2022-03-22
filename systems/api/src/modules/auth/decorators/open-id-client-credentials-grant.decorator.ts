import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { OpenIdClientCredentialsGrantGuard } from '../guards/open-id-client-credentials-grant.guard';

export function OpenIdClientCredentialsGrant() {
  return applyDecorators(
    UseGuards(OpenIdClientCredentialsGrantGuard),
    ApiBearerAuth(),
  );
}
