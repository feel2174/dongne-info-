"use client";

import { useMemo, useState } from "react";
import type { RegionSummary } from "@/lib/regions";

export default function RegionSearch({ regions }: { regions: RegionSummary[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().replace(/\s/g, "");
    if (!q) return [];
    return regions.filter((r) => `${r.sido}${r.sigungu}`.includes(q));
  }, [query, regions]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="mt-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="동네 이름으로 바로 검색 (예: 광명, 강남구)"
        className="w-full rounded-xl border-2 border-green bg-white px-5 py-4 text-lg font-medium text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-green-dark"
      />

      {/* 입력 전에는 힌트 한 줄만, 검색 중에만 결과 영역이 자연스럽게 나타남 —
          결과가 많을 때만 내부 스크롤로 전체 레이아웃이 과하게 늘어나는 걸 막음 */}
      {hasQuery && (
        <div className="mt-3">
          <p className="text-base font-semibold text-green-dark">
            {filtered.length}개 지역 찾음
          </p>

          <div className="mt-2 max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="text-base text-zinc-500">일치하는 지역이 없어요.</p>
            )}
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {filtered.map((r) => (
                <li key={`${r.sido}_${r.sigungu}`}>
                  <a
                    href={`/${encodeURIComponent(r.sido)}/${encodeURIComponent(r.sigungu)}`}
                    className="block cursor-pointer rounded-lg border-2 border-yellow bg-yellow-light px-3 py-2 text-base font-semibold text-green-dark hover:bg-yellow"
                  >
                    <span className="block">{r.sigungu}</span>
                    <span className="block text-sm font-normal text-zinc-500">{r.sido}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
