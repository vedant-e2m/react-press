'use strict';

/**
 * Strapi loads local plugin server entrypoints via loadConfigFile, which only
 * supports `.js` / `.json`. Keep this CommonJS file as the runtime entry.
 */
module.exports = {
  register({ strapi }) {
    strapi.customFields.register({
      name: 'builder-document',
      plugin: 'page-builder',
      type: 'json',
      inputSize: { default: 12, isResizable: true },
    });
  },
  bootstrap() {},
  controllers: {},
  routes: {},
  services: {},
  contentTypes: {},
  policies: {},
  middlewares: {},
  config: {},
};
