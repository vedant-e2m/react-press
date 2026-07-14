import type { CmsAdapter } from "@nextpress/cms-core";
import { StrapiContentProvider } from "./provider";

export { StrapiContentProvider } from "./provider";

export const cmsAdapter: CmsAdapter = {
  meta: { id: "strapi", displayName: "Strapi" },
  createProvider(config) {
    return new StrapiContentProvider(config);
  },
};

export default cmsAdapter;
