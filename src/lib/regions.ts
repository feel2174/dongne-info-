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

export function getRegionData(sido: string, sigungu: string): RegionFile | null {
  const file = path.join(DATA_DIR, `${sido}_${sigungu}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}
