"use client";

import { useMemo, useState } from "react";
import type { BagStore } from "@/lib/regions";

function extractDong(address: string): string {
  // 주소 끝의 "(광명동)", "(철산동)" 같은 괄호 안 동/읍/면 이름을 추출
  const match = address.match(/\(([^)]+)\)\s*$/);
  return match ? match[1] : "기타";
}

function naverMapUrl(store: BagStore) {
  const address = store.소재지도로명주소 || store.소재지지번주소 || "";
  const query = `${store.판매소명} ${address}`.trim();
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}

export default function BagStoreList({ stores }: { stores: BagStore[] }) {
  const [query, setQuery] = useState("");
  const [openDong, setOpenDong] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, BagStore[]>();
    for (const s of stores) {
      const address = s.소재지도로명주소 || s.소재지지번주소 || "";
      const dong = extractDong(address);
      if (!map.has(dong)) map.set(dong, []);
      map.get(dong)!.push(s);
    }
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [stores]);

  const hasQuery = query.trim().length > 0;

  const filteredGrouped = useMemo(() => {
    const q = query.trim();
    if (!q) return grouped;
    return grouped
      .map(([dong, list]): [string, BagStore[]] => [
        dong,
        list.filter(
          (s) =>
            s.판매소명.includes(q) ||
            dong.includes(q) ||
            (s.소재지도로명주소 || s.소재지지번주소 || "").includes(q)
        ),
      ])
      .filter(([, list]) => list.length > 0);
  }, [grouped, query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="동 이름이나 상호명으로 찾기 (예: 철산동, 이마트)"
        className="w-full rounded-xl border-2 border-yellow bg-white px-4 py-3 text-base font-medium text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-yellow-dark"
      />

      <p className="mt-2 text-sm text-zinc-500">
        {grouped.length}개 동네에 총 {stores.length}곳 · 동네를 눌러서 펼쳐보세요
      </p>

      <div className="mt-3 space-y-2">
        {filteredGrouped.length === 0 && (
          <p className="rounded-xl bg-white p-4 text-base text-zinc-500">
            일치하는 판매소가 없어요.
          </p>
        )}
        {filteredGrouped.map(([dong, list]) => {
          const isOpen = hasQuery || openDong === dong;
          return (
            <div
              key={dong}
              className="overflow-hidden rounded-xl border-2 border-yellow bg-white"
            >
              <button
                onClick={() => setOpenDong(openDong === dong ? null : dong)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left hover:bg-yellow-light/40"
              >
                <span className="text-lg font-bold text-zinc-900">{dong}</span>
                <span className="text-base text-zinc-500">
                  {list.length}곳 {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <ul className="divide-y-2 divide-yellow-light border-t-2 border-yellow-light">
                  {list.map((s, i) => (
                    <li key={i}>
                      <a
                        href={naverMapUrl(s)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block cursor-pointer px-4 py-3 hover:bg-yellow-light/40"
                      >
                        <p className="text-base font-bold text-zinc-900">
                          {s.판매소명}{" "}
                          <span
                            className={
                              s.영업상태명 === "영업"
                                ? "ml-1 rounded-full bg-green-light px-2 py-0.5 text-xs font-bold text-green-dark"
                                : "ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-400"
                            }
                          >
                            {s.영업상태명}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {s.소재지도로명주소 || s.소재지지번주소}
                          {s.전화번호 ? ` · ${s.전화번호}` : ""}
                          <span className="ml-1 text-green-dark">
                            · 네이버지도에서 보기 ↗
                          </span>
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
