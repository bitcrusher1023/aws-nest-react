import { Controller, Get, Inject, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppEnvironment } from '../config/config.constants';
import { NONCE } from './frontend.constants';

@Controller()
export class FrontendController {
  constructor(
    private config: ConfigService,
    @Inject(NONCE) private nonce: string,
  ) {}

  @Get('*')
  @Render('index')
  root() {
    const isDevelopment = [AppEnvironment.TEST, AppEnvironment.DEV].includes(
      this.config.get('env')!,
    );
    return {
      // https://vitejs.dev/guide/backend-integration.html#backend-integration
      cssFiles: [],
      isDevelopment,
      mainJS: isDevelopment
        ? 'http://localhost:3000/index.tsx'
        : 'https://cdn-link-here/manifest.main.file.js',
      nonce: this.nonce,
    };
  }
}
