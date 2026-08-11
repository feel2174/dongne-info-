import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data", "by_region");

export interface BagStore {
  판매소명: string;
  시도명: string;
  시군구명: string;
  소재지도로명주소: string;
  소재지지번주소: string;
  위도: number;
  경도: number;
  영업상태명: string;
  전화번호: string;
  관리기관명: string;
}

export interface WasteInfo {
  CTPV_NM: string;
  SGG_NM: string;
  MNG_ZONE_NM: string;
  MNG_ZONE_TRGT_RGN_NM: string;
  EMSN_PLC: string;
  EMSN_PLC_TYPE: string;
  LF_WST_EMSN_DOW: string;
  LF_WST_EMSN_BGNG_TM: string;
  LF_WST_EMSN_END_TM: string;
  LF_WST_EMSN_MTHD: string;
  FOD_WST_EMSN_DOW: string;
  FOD_WST_EMSN_BGNG_TM: string;
  FOD_WST_EMSN_END_TM: string;
  FOD_WST_EMSN_MTHD: string;
  RCYCL_EMSN_DOW: string;
  RCYCL_EMSN_BGNG_TM: string;
  RCYCL_EMSN_END_TM: string;
  RCYCL_EMSN_MTHD: string;
  TMPRY_BULK_WASTE_EMSN_MTHD: string;
  UNCLLT_DAY: string;
  MNG_DEPT_NM: string;
  MNG_DEPT_TELNO: string;
}

export interface ParkingLot {
  주차장명: string;
  주차장구분: string;
  주차장유형: string;
  소재지도로명주소: string;
  소재지지번주소: string;
  주차구획수: string;
  운영요일: string;
  평일운영시작시각: string;
  평일운영종료시각: string;
  토요일운영시작시각: string;
  토요일운영종료시각: string;
  공휴일운영시작시각: string;
  공휴일운영종료시각: string;
  요금정보: string;
  주차기본시간: string;
  주차기본요금: string;
  추가단위시간: string;
  추가단위요금: string;
  결제방법: string;
  특기사항: string;
  관리기관명: string;
  전화번호: string;
  장애인전용주차구역보유여부: string;
}

export interface ResidentParkingZone {
  거주자우선주차구역명: string;
  소재지도로명주소: string;
  소재지지번주소: string;
  운영형태: string;
  사용시간대정보: string;
  사용기간: string;
  이용요금: string;
  이용요금할인정보: string;
  정기접수시작일자: string;
  정기접수종료일자: string;
  신청방법: string;
  신청서류: string;
  관리기관전화번호: string;
  관리기관명: string;
  /** dedupeResidentParking에서 계산해 채워 넣는 값. 원본 데이터엔 없음. */
  구획수?: number;
}

export interface RegionFile {
  bag_stores?: BagStore[];
  waste_info?: WasteInfo[];
  parking?: ParkingLot[];
  resident_parking?: ResidentParkingZone[];
}

export interface RegionSummary {
  sido: string;
  sigungu: string;
  slug: { sido: string; sigungu: string };
  bagStoreCount: number;
  wasteInfoCount: number;
}

function parseKey(fileStem: string): { sido: string; sigungu: string } {
  const idx = fileStem.indexOf("_");
  if (idx === -1) return { sido: fileStem, sigungu: fileStem };
  return { sido: fileStem.slice(0, idx), sigungu: fileStem.slice(idx + 1) };
}

let cachedFiles: string[] | null = null;

function listRegionFiles(): string[] {
  if (!cachedFiles) {
    cachedFiles = fs.existsSync(DATA_DIR)
      ? fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"))
      : [];
  }
  return cachedFiles;
}

export function getAllRegionSummaries(): RegionSummary[] {
  return listRegionFiles().map((file) => {
    const stem = file.replace(/\.json$/, "");
    const { sido, sigungu } = parseKey(stem);
    const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
    const parsed: RegionFile = JSON.parse(raw);
    return {
      sido,
      sigungu,
      slug: { sido, sigungu },
      bagStoreCount: parsed.bag_stores?.length ?? 0,
      wasteInfoCount: parsed.waste_info?.length ?? 0,
    };
  });
}

// 일부 지역(예: 정선군)은 원본 API에 같은 구역(면/읍 단위) 배출 정보가
// 수거지점(EMSN_PLC, 리 단위 클린하우스 등) 개수만큼 반복돼 있어서
// (정선군만 15개 구역인데 2,203행) 그대로 렌더링하면 페이지가 비정상적으로
// 커진다(20MB+, Vercel ISR 페이지 크기 제한 초과) — 사용자 입장에서도 같은
// 요일 정보를 리마다 수십~수백 번 보는 건 의미가 없다. EMSN_PLC(구체적
// 수거지점)는 제외하고 "구역+배출방식+요일/시간" 기준으로 중복을 제거한다.
function dedupeWasteInfo(items: WasteInfo[]): WasteInfo[] {
  const seen = new Set<string>();
  const result: WasteInfo[] = [];
  for (const w of items) {
    const key = [
      w.MNG_ZONE_TRGT_RGN_NM,
      w.EMSN_PLC_TYPE,
      w.LF_WST_EMSN_DOW,
      w.LF_WST_EMSN_BGNG_TM,
      w.LF_WST_EMSN_END_TM,
      w.FOD_WST_EMSN_DOW,
      w.FOD_WST_EMSN_BGNG_TM,
      w.FOD_WST_EMSN_END_TM,
      w.RCYCL_EMSN_DOW,
      w.RCYCL_EMSN_BGNG_TM,
      w.RCYCL_EMSN_END_TM,
      w.UNCLLT_DAY,
    ].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(w);
  }
  return result;
}

// 거주자우선주차 원본 데이터는 "구역" 단위가 아니라 "구획"(개별 주차칸) 단위로
// 한 행씩 들어있다 — 같은 구역 안에 수십~수천 개 구획이 있으면 그만큼 행이
// 반복된다(예: 울산 남구 한 곳만 7,561행인데 실제 구역은 1,099개). 사용자가
// 궁금한 건 "이 구역에서 신청할 수 있다"는 사실이지 구획 번호 하나하나가
// 아니므로, 구역명+주소 기준으로 대표 1건만 남기고 구획 수를 세어 붙인다.
function dedupeResidentParking(items: ResidentParkingZone[]): ResidentParkingZone[] {
  const groups = new Map<string, ResidentParkingZone[]>();
  for (const item of items) {
    const key = `${item.거주자우선주차구역명}|${item.소재지도로명주소 || item.소재지지번주소}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }
  return [...groups.values()].map((group) => ({ ...group[0], 구획수: group.length }));
}

export function getRegionData(sido: string, sigungu: string): RegionFile | null {
  const file = path.join(DATA_DIR, `${sido}_${sigungu}.json`);
  if (!fs.existsSync(file)) return null;
  const parsed: RegionFile = JSON.parse(fs.readFileSync(file, "utf-8"));
  if (parsed.waste_info) {
    parsed.waste_info = dedupeWasteInfo(parsed.waste_info);
  }
  if (parsed.resident_parking) {
    parsed.resident_parking = dedupeResidentParking(parsed.resident_parking);
  }
  return parsed;
}
