import type { MetadataRoute } from "next";
import { getAllRegionSummaries } from "@/lib/regions";

// TODO: layout.tsx의 SITE_URL과 함께 실제 도메인으로 교체
const baseUrl = "https://dongne-info.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const regions = getAllRegionSummaries();

  const home: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  };

  const regionPages: MetadataRoute.Sitemap = regions.map((r) => ({
    url: `${baseUrl}/${encodeURIComponent(r.sido)}/${encodeURIComponent(r.sigungu)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [home, ...regionPages];
}
