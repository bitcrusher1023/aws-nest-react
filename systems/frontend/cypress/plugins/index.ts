import { startDevServer } from '@cypress/vite-dev-server';
import path from 'path';
import DevServerConfig = Cypress.DevServerConfig;

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on: Cypress.PluginEvents) => {
  on('dev-server:start', (options: DevServerConfig) => {
    return startDevServer({
      options,
      viteConfig: {
        configFile: path.resolve(__dirname, '..', '..', 'vite.config.ts'),
      },
    });
  });
};
