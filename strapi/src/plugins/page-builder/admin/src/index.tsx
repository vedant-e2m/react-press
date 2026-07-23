import type { StrapiApp } from '@strapi/strapi/admin';
import pluginId from './pluginId';
import PageBuilderIcon from './components/PageBuilderIcon';

interface ContentManagerApis {
  addDocumentHeaderAction?: (
    actions:
      | Array<{
          ({ model, documentId }: { model: string; documentId?: string }): {
            label: string;
            disabled?: boolean;
            onClick?: () => void;
          } | null;
        }>
      | ((
          prev: Array<unknown>
        ) => Array<unknown>)
  ) => void;
}

/**
 * Registers the Page Builder plugin, custom field, menu link, and CM header action.
 */
export default {
  register(app: StrapiApp) {
    app.registerPlugin({
      id: pluginId,
      name: 'Page Builder',
    });

    app.customFields.register({
      name: 'builder-document',
      pluginId,
      type: 'json',
      intlLabel: {
        id: `${pluginId}.builder-document.label`,
        defaultMessage: 'Builder Document',
      },
      intlDescription: {
        id: `${pluginId}.builder-document.description`,
        defaultMessage: 'Visual page layout edited with the NextPress Page Builder',
      },
      icon: PageBuilderIcon,
      components: {
        Input: async () =>
          import('./components/BuilderDocumentInput').then((module) => ({
            default: module.default,
          })),
      },
    });

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PageBuilderIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Page Builder',
      },
      Component: async () => {
        const module = await import('./pages/App');
        return { default: module.default };
      },
      permissions: [],
    });
  },

  bootstrap(app: StrapiApp) {
    const contentManager = app.getPlugin('content-manager');
    const apis = contentManager?.apis as ContentManagerApis | undefined;

    if (!apis?.addDocumentHeaderAction) {
      return;
    }

    apis.addDocumentHeaderAction([
      ({ model, documentId }) => {
        if (model !== 'api::page.page') {
          return null;
        }

        const canOpen = Boolean(documentId) && documentId !== 'create';

        return {
          label: 'Open Page Builder',
          disabled: !canOpen,
          onClick: () => {
            if (!canOpen || !documentId) {
              return;
            }
            window.location.assign(`/admin/plugins/${pluginId}/pages/${documentId}`);
          },
        };
      },
    ]);
  },
};
