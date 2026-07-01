import { configureStrapiClient } from "@nextpress/strapi-client";

configureStrapiClient({
  url: import.meta.env.VITE_STRAPI_URL ?? "http://localhost:1337",
});

export {
  strapi,
  strapiFetch,
  strapiLogin,
  configureStrapiClient,
  getStrapiUrl,
} from "@nextpress/strapi-client";
export type { StrapiClientError } from "@nextpress/strapi-client";
