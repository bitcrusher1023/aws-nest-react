import injectDevServer from '@cypress/react/plugins/react-scripts';
import PluginConfigOptions = Cypress.PluginConfigOptions;

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on: Cypress.PluginEvents, config: PluginConfigOptions) => {
  injectDevServer(on, config);
  return config;
};
