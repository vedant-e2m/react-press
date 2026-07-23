import type { Core } from '@strapi/strapi';

/**
 * Registers the builder-document custom field on the Strapi server.
 */
const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'builder-document',
    plugin: 'page-builder',
    type: 'json',
    inputSize: { default: 12, isResizable: true },
  });
};

export default register;
