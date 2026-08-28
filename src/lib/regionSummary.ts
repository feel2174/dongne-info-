import type { BagStore, WasteInfo } from "@/lib/regions";

export interface FaqItem {
  q: string;
  a: string;
}

export interface RegionSummary {
  /** 페이지 상단에 노출할 지역 맥락 소개 문단 */
  intro: string;
  /** FAQPage 구조화 데이터 + 화면 노출용 */
  faqs: FaqItem[];
}

// "월+수+금" 형태의 원본 요일 문자열을 "월·수·금요일"처럼 사람이 읽기 좋은
// 문구로 바꾼다. 파싱 가능한 요일이 없으면(매일/공휴일 등) 원문을 그대로 쓴다.
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function prettyDow(dow: string): string | null {
  const days = dow
    .split("+")
    .map((d) => d.trim())
    .filter((d) => WEEKDAYS.includes(d));
  if (days.length === 0) {
    const t = dow.trim();
    return t.length > 0 ? t : null;
  }
  if (days.length === 7) return "매일";
  return `${days.join("·")}요일`;
}

// 여러 구역의 값 중 가장 흔한 요일 표기를 대표값으로 뽑는다.
function mostCommonDow(items: WasteInfo[], key: keyof WasteInfo): string | null {
  const counts = new Map<string, number>();
  for (const w of items) {
    const raw = String(w[key] ?? "").trim();
    if (!raw) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  let best: string | null = null;
  let bestN = 0;
  for (const [val, n] of counts) {
    if (n > bestN) {
      best = val;
      bestN = n;
    }
  }
  return best ? prettyDow(best) : null;
}

/**
 * 지역별 실제 데이터(판매소 수·영업 수·배출 요일)에서 도출한 고유 소개 문단과
 * FAQ를 생성한다. 공공데이터를 그대로 노출하는 데 그치지 않고, 각 페이지에
 * 지역 맥락과 이용 안내라는 편집적 부가가치를 더하기 위한 것.
 */
export function buildRegionSummary(args: {
  sido: string;
  sigungu: string;
  displaySido: string; // 별칭 포함 표기 (예: "서울시")
  bagStores: BagStore[];
  openBagStores: BagStore[];
  wasteInfo: WasteInfo[];
}): RegionSummary {
  const { sido, sigungu, displaySido, bagStores, openBagStores, wasteInfo } = args;
  const total = bagStores.length;
  const open = openBagStores.length;
  const hasWaste = wasteInfo.length > 0;
  const region = `${displaySido} ${sigungu}`;

  const recycling = hasWaste ? mostCommonDow(wasteInfo, "RCYCL_EMSN_DOW") : null;
  const general = hasWaste ? mostCommonDow(wasteInfo, "LF_WST_EMSN_DOW") : null;
  const food = hasWaste ? mostCommonDow(wasteInfo, "FOD_WST_EMSN_DOW") : null;

  const intro =
    `${region}에서 생활쓰레기를 버리거나 종량제봉투를 사려면 우리 동네의 배출 요일과 ` +
    `가까운 판매소를 미리 알아두면 편리합니다. 이 페이지에서는 ${sigungu}의 ` +
    (hasWaste ? "쓰레기 배출 요일·시간과 " : "") +
    (total > 0
      ? `종량제봉투 판매소 ${total}곳(${open}곳 영업 중) 정보를 한곳에 모았습니다.`
      : "생활정보를 정리해 제공합니다.");

  const faqs: FaqItem[] = [];

  faqs.push({
    q: `${sigungu} 종량제봉투는 어디서 사나요?`,
    a:
      total > 0
        ? `${sigungu}에는 종량제봉투 판매소가 ${total}곳 등록되어 있으며 이 중 ${open}곳이 영업 중입니다. ` +
          `대부분 편의점·마트·철물점 등에서 취급하니, 위 '종량제봉투 판매소' 목록에서 동네별로 가까운 곳을 찾아보세요.`
        : `현재 ${sigungu}의 종량제봉투 판매소 데이터는 준비 중입니다. 가까운 편의점·마트나 주민센터에 문의해 보세요.`,
  });

  if (hasWaste && recycling) {
    faqs.push({
      q: `${sigungu} 재활용 쓰레기는 무슨 요일에 버리나요?`,
      a:
        `공공데이터 기준 ${sigungu}의 재활용품은 주로 ${recycling}에 배출합니다. ` +
        `다만 같은 시군구 안에서도 구역(읍·면·동)에 따라 요일과 시간이 다를 수 있으니, ` +
        `위 '쓰레기 배출 정보'에서 우리 구역을 확인하세요.`,
    });
  }

  if (hasWaste && (general || food)) {
    const parts: string[] = [];
    if (general) parts.push(`일반쓰레기는 주로 ${general}`);
    if (food) parts.push(`음식물쓰레기는 주로 ${food}`);
    faqs.push({
      q: `${sigungu} 일반쓰레기·음식물쓰레기 배출 요일도 알 수 있나요?`,
      a:
        `네. ${parts.join(", ")}에 배출합니다. 배출은 정해진 시간(주로 저녁부터 자정 사이)에 ` +
        `지정된 장소로 내놓아야 하며, 자세한 요일·시간은 위 배출 정보 카드에서 구역별로 확인할 수 있습니다.`,
    });
  }

  faqs.push({
    q: `여기 나온 정보가 실제와 다를 수 있나요?`,
    a:
      `이 페이지는 행정안전부·공공데이터포털이 제공하는 공개 데이터를 가공한 참고용 정보입니다. ` +
      `판매소 영업 여부나 배출 요일이 바뀌었을 수 있으니, 정확한 기준은 ${sido} ${sigungu}청의 공지사항에서 다시 확인해 주세요.`,
  });

  return { intro, faqs };
}
