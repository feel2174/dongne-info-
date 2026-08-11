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

export interface RegionFile {
  bag_stores?: BagStore[];
  waste_info?: WasteInfo[];
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

export function getRegionData(sido: string, sigungu: string): RegionFile | null {
  const file = path.join(DATA_DIR, `${sido}_${sigungu}.json`);
  if (!fs.existsSync(file)) return null;
  const parsed: RegionFile = JSON.parse(fs.readFileSync(file, "utf-8"));
  if (parsed.waste_info) {
    parsed.waste_info = dedupeWasteInfo(parsed.waste_info);
  }
  return parsed;
}
