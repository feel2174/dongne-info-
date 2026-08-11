"use client";

import { useMemo, useState } from "react";
import type { WasteInfo } from "@/lib/regions";
import DayBadges from "@/components/DayBadges";

const AUTO_EXPAND_THRESHOLD = 3;

function zoneName(w: WasteInfo) {
  return w.MNG_ZONE_TRGT_RGN_NM && w.MNG_ZONE_TRGT_RGN_NM !== "없음"
    ? w.MNG_ZONE_TRGT_RGN_NM
    : "전체";
}

function WasteCard({ w }: { w: WasteInfo }) {
  return (
    <div className="rounded-2xl border-2 border-yellow bg-white p-5 shadow-sm">
      <p className="text-base text-zinc-500">
        배출 방식: {w.EMSN_PLC_TYPE} ({w.EMSN_PLC})
      </p>
      <dl className="mt-4 space-y-3 text-lg">
        <div className="rounded-lg bg-green-light px-4 py-3">
          <dt className="font-bold text-green-dark">🟢 일반쓰레기</dt>
          <dd className="mt-2 flex flex-wrap items-center gap-2 text-zinc-800">
            <DayBadges dow={w.LF_WST_EMSN_DOW} />
            <span>
              {w.LF_WST_EMSN_BGNG_TM}~{w.LF_WST_EMSN_END_TM}
            </span>
          </dd>
        </div>
        <div className="rounded-lg bg-yellow-light px-4 py-3">
          <dt className="font-bold text-yellow-dark">🟡 음식물쓰레기</dt>
          <dd className="mt-2 flex flex-wrap items-center gap-2 text-zinc-800">
            <DayBadges dow={w.FOD_WST_EMSN_DOW} />
            <span>
              {w.FOD_WST_EMSN_BGNG_TM}~{w.FOD_WST_EMSN_END_TM}
            </span>
          </dd>
        </div>
        <div className="rounded-lg bg-green-light px-4 py-3">
          <dt className="font-bold text-green-dark">♻️ 재활용품</dt>
          <dd className="mt-2 flex flex-wrap items-center gap-2 text-zinc-800">
            <DayBadges dow={w.RCYCL_EMSN_DOW} />
            <span>
              {w.RCYCL_EMSN_BGNG_TM}~{w.RCYCL_EMSN_END_TM}
            </span>
          </dd>
        </div>
      </dl>
      {w.UNCLLT_DAY && (
        <p className="mt-4 text-base text-zinc-500">
          <span className="font-bold text-zinc-700">미수거일:</span> {w.UNCLLT_DAY}
        </p>
      )}
      {w.MNG_DEPT_NM && (
        <p className="mt-1 text-base text-zinc-500">
          <span className="font-bold text-zinc-700">문의:</span> {w.MNG_DEPT_NM} {w.MNG_DEPT_TELNO}
        </p>
      )}
    </div>
  );
}

export default function WasteInfoList({ items }: { items: WasteInfo[] }) {
  const grouped = useMemo(() => {
    const map = new Map<string, WasteInfo[]>();
    for (const w of items) {
      const zone = zoneName(w);
      if (!map.has(zone)) map.set(zone, []);
      map.get(zone)!.push(w);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], "ko"));
  }, [items]);

  const [query, setQuery] = useState("");
  const [openZone, setOpenZone] = useState<string | null>(null);

  // 구역이 몇 개 안 되면 굳이 접어둘 필요가 없어서 바로 전부 보여준다.
  if (grouped.length <= AUTO_EXPAND_THRESHOLD) {
    return (
      <div className="space-y-5">
        {grouped.map(([zone, list]) => (
          <div key={zone}>
            {grouped.length > 1 && (
              <p className="mb-2 inline-block rounded-full bg-yellow-light px-3 py-1 text-base font-bold text-yellow-dark">
                적용 구역: {zone}
              </p>
            )}
            <div className="space-y-5">
              {list.map((w, i) => (
                <WasteCard key={i} w={w} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const hasQuery = query.trim().length > 0;
  const filtered = hasQuery
    ? grouped.filter(([zone]) => zone.includes(query.trim()))
    : grouped;

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="구역(읍/면/동) 이름으로 찾기"
        className="w-full rounded-xl border-2 border-yellow bg-white px-4 py-3 text-base font-medium text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-yellow-dark"
      />
      <p className="mt-2 text-sm text-zinc-500">
        {grouped.length}개 구역 · 구역을 눌러서 펼쳐보세요
      </p>

      <div className="mt-3 space-y-2">
        {filtered.length === 0 && (
          <p className="rounded-xl bg-white p-4 text-base text-zinc-500">
            일치하는 구역이 없어요.
          </p>
        )}
        {filtered.map(([zone, list]) => {
          const isOpen = hasQuery || openZone === zone;
          return (
            <div key={zone} className="overflow-hidden rounded-xl border-2 border-yellow bg-white">
              <button
                onClick={() => setOpenZone(openZone === zone ? null : zone)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left hover:bg-yellow-light/40"
              >
                <span className="text-lg font-bold text-zinc-900">{zone}</span>
                <span className="text-base text-zinc-500">
                  {list.length}건 {isOpen ? "▲" : "▼"}
                </span>
              </button>
              {isOpen && (
                <div className="space-y-4 border-t-2 border-yellow-light p-4">
                  {list.map((w, i) => (
                    <WasteCard key={i} w={w} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
