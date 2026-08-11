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

  return (
    <div className="mt-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="동네 이름으로 바로 검색 (예: 광명, 강남구)"
        className="w-full rounded-xl border-2 border-green bg-white px-5 py-4 text-lg font-medium text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-green-dark"
      />

      {query.trim() && (
        <>
          <p className="mt-3 text-base font-semibold text-green-dark">
            {filtered.length}개 지역 찾음
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {filtered.map((r) => (
              <li key={`${r.sido}_${r.sigungu}`}>
                <a
                  href={`/${encodeURIComponent(r.sido)}/${encodeURIComponent(r.sigungu)}`}
                  className="block rounded-lg border-2 border-yellow bg-yellow-light px-3 py-2 text-base font-semibold text-green-dark hover:bg-yellow"
                >
                  <span className="block">{r.sigungu}</span>
                  <span className="block text-sm font-normal text-zinc-500">{r.sido}</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
