"use client";

import { useState } from "react";
import type { RegionSummary } from "@/lib/regions";

interface Tile {
  sido: string;
  short: string;
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
}

// 실제 지리적 위치를 단순화한 타일 배치 (선거 결과 지도 등에서 흔히 쓰는 카토그램 방식)
// 모든 타일은 1x1 — 겹침 없이 유일한 (col, row)만 사용
const TILES: Tile[] = [
  { sido: "강원특별자치도", short: "강원", col: 5, row: 1 },
  { sido: "경기도", short: "경기", col: 3, row: 2 },
  { sido: "인천광역시", short: "인천", col: 2, row: 3 },
  { sido: "서울특별시", short: "서울", col: 3, row: 3 },
  { sido: "충청북도", short: "충북", col: 5, row: 3 },
  { sido: "경상북도", short: "경북", col: 6, row: 3 },
  { sido: "충청남도", short: "충남", col: 3, row: 4 },
  { sido: "세종특별자치시", short: "세종", col: 4, row: 4 },
  { sido: "전북특별자치도", short: "전북", col: 3, row: 5 },
  { sido: "대전광역시", short: "대전", col: 4, row: 5 },
  { sido: "대구광역시", short: "대구", col: 6, row: 5 },
  { sido: "울산광역시", short: "울산", col: 7, row: 5 },
  { sido: "광주광역시", short: "광주", col: 3, row: 6 },
  { sido: "경상남도", short: "경남", col: 5, row: 6 },
  { sido: "부산광역시", short: "부산", col: 7, row: 6 },
  { sido: "전라남도", short: "전남", col: 3, row: 7 },
  { sido: "제주특별자치도", short: "제주", col: 3, row: 9 },
];

export default function KoreaMap({ regions }: { regions: RegionSummary[] }) {
  const [selectedSido, setSelectedSido] = useState<string | null>(null);

  const bySido = new Map<string, RegionSummary[]>();
  for (const r of regions) {
    if (!bySido.has(r.sido)) bySido.set(r.sido, []);
    bySido.get(r.sido)!.push(r);
  }

  const selectedRegions = selectedSido ? (bySido.get(selectedSido) ?? []) : [];

  return (
    <div>
      <div
        className="grid gap-2 mx-auto max-w-xl"
        style={{
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gridAutoRows: "56px",
        }}
      >
        {TILES.map((t) => {
          const available = bySido.has(t.sido);
          const isSelected = selectedSido === t.sido;
          return (
            <button
              key={t.sido}
              disabled={!available}
              onClick={() => setSelectedSido(isSelected ? null : t.sido)}
              style={{
                gridColumn: `${t.col} / span ${t.colSpan ?? 1}`,
                gridRow: `${t.row} / span ${t.rowSpan ?? 1}`,
              }}
              className={[
                "rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl transition-all border-2",
                !available
                  ? "bg-zinc-100 text-zinc-300 border-zinc-200 cursor-not-allowed"
                  : isSelected
                    ? "bg-green text-white border-green-dark scale-105 shadow-lg"
                    : "bg-yellow-light text-green-dark border-yellow hover:bg-yellow hover:scale-105",
              ].join(" ")}
            >
              {t.short}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-base text-zinc-500">
        회색 지역은 아직 데이터가 준비되지 않았어요. 초록/노랑 지역을 눌러보세요.
      </p>

      {selectedSido && (
        <div className="mt-6 rounded-2xl border-4 border-green bg-white p-5">
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
                    className="block rounded-lg bg-yellow-light px-3 py-2 text-center text-base font-semibold text-green-dark hover:bg-yellow"
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
