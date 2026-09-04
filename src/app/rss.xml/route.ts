import { getAllRegionSummaries } from "@/lib/regions";
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  regionDescription,
  regionTitle,
} from "@/lib/site";

// 데이터 파일에서 읽어오는 값만 쓰므로 빌드 시점에 한 번 생성해두면 된다.
// (Next 16의 Route Handler는 기본이 동적이라 명시적으로 켜줘야 한다)
export const dynamic = "force-static";

// 콘텐츠 발행 시각. data/by_region 데이터를 새로 수집해 반영할 때만 갱신한다.
// 배포 시각(new Date())을 쓰면 코드만 고친 배포에도 239건 전체가 "새 글"로
// 보여서 네이버 쪽에 잘못된 신선도 신호를 주게 되므로 고정값으로 둔다.
const CONTENT_PUBLISHED_AT = new Date("2026-08-11T18:25:03+09:00");

// 네이버 서치어드바이저는 pubDate가 RFC-822가 아니면 피드를 반려한다.
// (예: "Tue, 11 Aug 2026 18:25:03 +0900")
const KST_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function rfc822(date: Date): string {
  const p: Record<string, string> = {};
  for (const { type, value } of KST_PARTS.formatToParts(date)) p[type] = value;
  return `${p.weekday}, ${p.day} ${p.month} ${p.year} ${p.hour}:${p.minute}:${p.second} +0900`;
}

function xmlText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function regionUrl(sido: string, sigungu: string): string {
  return `${SITE_URL}/${encodeURIComponent(sido)}/${encodeURIComponent(sigungu)}`;
}

export async function GET() {
  const pubDate = rfc822(CONTENT_PUBLISHED_AT);

  // 데이터가 하나도 없는 지역 페이지(빈 껍데기 9곳)는 피드에서 뺀다. RSS는 네이버가
  // "새 콘텐츠" 신호로 더 무겁게 읽는 경로라 빈 페이지를 섞으면 희석된다.
  // sitemap.xml에는 그대로 남아 있으므로 색인 경로 자체가 막히는 건 아니다.
  const items = getAllRegionSummaries()
    .filter((r) => r.bagStoreCount + r.wasteInfoCount > 0)
    .map((r) => {
      const url = regionUrl(r.sido, r.sigungu);
      return `    <item>
      <title>${xmlText(regionTitle(r.sido, r.sigungu))}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${cdata(regionDescription(r.sido, r.sigungu))}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    });

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlText(SITE_TITLE)}</title>
    <link>${SITE_URL}/</link>
    <description>${xmlText(SITE_DESCRIPTION)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
