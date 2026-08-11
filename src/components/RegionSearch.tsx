"use client";

import { useMemo, useState } from "react";
import type { RegionSummary } from "@/lib/regions";

export default function RegionSearch({ regions }: { regions: RegionSummary[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().replace(/\s/g, "");
    if (!q) return regions;
    return regions.filter((r) => `${r.sido}${r.sigungu}`.includes(q));
  }, [query, regions]);

  return (
    <div className="mt-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="동네 이름으로 검색 (예: 광명, 강남구)"
        className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-base outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
      />

      <p className="mt-3 text-sm text-zinc-500">{filtered.length}개 지역</p>

      <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {filtered.map((r) => (
          <li key={`${r.sido}_${r.sigungu}`}>
            <a
              href={`/${encodeURIComponent(r.sido)}/${encodeURIComponent(r.sigungu)}`}
              className="block rounded-md border border-zinc-200 px-3 py-2 text-sm hover:border-zinc-400 dark:border-zinc-800"
            >
              <span className="block font-medium text-zinc-900 dark:text-zinc-50">
                {r.sigungu}
              </span>
              <span className="block text-xs text-zinc-500">{r.sido}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
