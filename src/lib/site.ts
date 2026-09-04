import { sidoAlias } from "./sidoAlias";

export const SITE_URL = "https://dongne-info.zucca100.com";
export const SITE_NAME = "우리동네 생활정보";

export const SITE_TITLE = `${SITE_NAME} | 재활용 쓰레기 버리는 날 · 종량제봉투`;
export const SITE_DESCRIPTION =
  "전국 시군구별 재활용·음식물·일반쓰레기 배출 요일과 시간, 종량제봉투 판매소 위치를 확인하세요.";

/** "강원특별자치도(강원도)"처럼 검색어에 흔히 쓰이는 축약형을 괄호로 덧붙인다. */
export function sidoWithAlias(sido: string): string {
  const alias = sidoAlias(sido);
  return alias ? `${sido}(${alias})` : sido;
}

// 지역 페이지의 title/description은 페이지 메타데이터와 RSS 피드 양쪽에서 쓴다.
// 네이버 서치어드바이저는 RSS의 title/description을 그대로 읽으므로 실제 페이지
// 메타데이터와 어긋나면 안 된다 — 한 군데서만 만들어 둘 다 여기서 가져다 쓴다.
export function regionTitle(sido: string, sigungu: string): string {
  return `${sidoWithAlias(sido)} ${sigungu} 재활용 쓰레기 버리는 날 · 종량제봉투 파는 곳`;
}

export function regionDescription(sido: string, sigungu: string): string {
  return `${sidoWithAlias(sido)} ${sigungu}의 생활쓰레기·음식물쓰레기·재활용품 배출 요일과 시간, 종량제봉투 판매소 위치를 한눈에 확인하세요.`;
}
