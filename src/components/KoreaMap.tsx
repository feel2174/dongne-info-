"use client";

import { useEffect, useRef, useState } from "react";
// @svg-maps/south-korea ships a type declaration that depends on an
// unpublished "svg-maps__common" types package, so it resolves to `any`.
// Import as unknown and cast to a minimal local shape instead.
import southKoreaRaw from "@svg-maps/south-korea";
import type { RegionSummary } from "@/lib/regions";

interface SvgMapLocation {
  id: string;
  name: string;
  path: string;
}

interface SvgMap {
  viewBox: string;
  locations: SvgMapLocation[];
}

const southKorea = southKoreaRaw as unknown as SvgMap;

// @svg-maps/south-korea 영문 id -> 실제 데이터의 한글 시도명
const ID_TO_SIDO: Record<string, string> = {
  busan: "부산광역시",
  daegu: "대구광역시",
  daejeon: "대전광역시",
  gangwon: "강원특별자치도",
  gwangju: "광주광역시",
  gyeonggi: "경기도",
  incheon: "인천광역시",
  jeju: "제주특별자치도",
  "north-chungcheong": "충청북도",
  "north-gyeongsang": "경상북도",
  "north-jeolla": "전북특별자치도",
  sejong: "세종특별자치시",
  seoul: "서울특별시",
  "south-chungcheong": "충청남도",
  "south-gyeongsang": "경상남도",
  "south-jeolla": "전라남도",
  ulsan: "울산광역시",
};

export default function KoreaMap({ regions }: { regions: RegionSummary[] }) {
  const [selectedSido, setSelectedSido] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const bySido = new Map<string, RegionSummary[]>();
  for (const r of regions) {
    if (!bySido.has(r.sido)) bySido.set(r.sido, []);
    bySido.get(r.sido)!.push(r);
  }

  useEffect(() => {
    if (selectedSido && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSido]);

  const selectedRegions = selectedSido ? (bySido.get(selectedSido) ?? []) : [];

  return (
    <div>
      <svg
        viewBox={southKorea.viewBox}
        role="img"
        aria-label="대한민국 지도"
        className="mx-auto w-full max-w-md"
      >
        {southKorea.locations.map((loc) => {
          const sido = ID_TO_SIDO[loc.id];
          const available = bySido.has(sido);
          const isSelected = selectedSido === sido;

          return (
            <path
              key={loc.id}
              d={loc.path}
              onClick={() => available && setSelectedSido(isSelected ? null : sido)}
              className={[
                "stroke-white transition-colors",
                !available
                  ? "fill-zinc-200 cursor-not-allowed"
                  : isSelected
                    ? "fill-green cursor-pointer"
                    : "fill-yellow hover:fill-yellow-dark cursor-pointer",
              ].join(" ")}
              strokeWidth={2}
            >
              <title>{sido ?? loc.name}</title>
            </path>
          );
        })}
      </svg>

      <p className="mt-4 text-center text-base text-zinc-500">
        회색 지역은 아직 데이터가 준비되지 않았어요. 초록/노랑 지역을 눌러보세요.
      </p>

      {selectedSido && (
        <div
          ref={panelRef}
          className="mt-6 scroll-mt-6 rounded-2xl border-4 border-green bg-white p-5"
        >
          <h2 className="text-xl font-bold text-green-dark mb-3">
            {selectedSido} 시군구 ({selectedRegions.length}개)
          </h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {selectedRegions
              .sort((a, b) => a.sigungu.localeCompare(b.sigungu, "ko"))
              .map((r) => (
                <li key={r.sigungu}>
                  <a
                    href={`/${encodeURIComponent(r.sido)}/${encodeURIComponent(r.sigungu)}`}
                    className="block cursor-pointer rounded-lg bg-yellow-light px-3 py-2 text-center text-base font-semibold text-green-dark hover:bg-yellow"
                  >
                    {r.sigungu}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
