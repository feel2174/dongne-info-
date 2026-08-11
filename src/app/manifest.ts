import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description:
      "전국 시군구별 재활용·음식물·일반쓰레기 배출 요일과 시간, 종량제봉투 판매소 위치를 확인하세요.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffbea",
    theme_color: "#16a34a",
    lang: "ko",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
