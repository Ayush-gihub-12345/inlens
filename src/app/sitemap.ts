import type { MetadataRoute } from "next";
import { getAllServices } from "@/lib/services";

const BASE_URL = "https://gov.inlens.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const services = getAllServices();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/services`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/updates`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/search`, changeFrequency: "weekly", priority: 0.5 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: service.lastVerified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const stateRoutes: MetadataRoute.Sitemap = services.flatMap((service) =>
    (service.stateVariants ?? []).map((variant) => ({
      url: `${BASE_URL}/services/${service.slug}/${variant.stateCode}`,
      lastModified: service.lastVerified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...staticRoutes, ...serviceRoutes, ...stateRoutes];
}
