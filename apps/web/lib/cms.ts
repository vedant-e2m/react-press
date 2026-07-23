import { initCms, getCms } from "@nextpress/cms-core";
import { cmsAdapter as strapiAdapter } from "@nextpress/cms-strapi";
import { resolveCmsUrl } from "./cms-url";

initCms(strapiAdapter, { url: resolveCmsUrl() });

export { getCms };
export type { ContentPage, ContentPage as Page, PageStatus } from "@nextpress/cms-core";
export type { BuilderDocument } from "@nextpress/builder";
