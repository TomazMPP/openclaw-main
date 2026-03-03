import { appConfig } from "~/config/app";
import { pathsConfig } from "~/config/paths";
import { USE_CASES } from "~/modules/marketing/use-cases/data";

import type { MetadataRoute } from "next";

const url = (path: string) => `${appConfig.url}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const useCaseEntries: MetadataRoute.Sitemap = USE_CASES.map((uc) => ({
    url: url(`/${uc.slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: url(pathsConfig.index),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...useCaseEntries,
  ];
}
