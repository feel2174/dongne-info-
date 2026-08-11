"use client";

import type { BagStore } from "@/lib/regions";
import AddressGroupedList from "@/components/AddressGroupedList";

export default function BagStoreList({ stores }: { stores: BagStore[] }) {
  return (
    <AddressGroupedList
      items={stores}
      unit="곳"
      searchPlaceholder="동 이름이나 상호명으로 찾기 (예: 철산동, 이마트)"
      emptyText="일치하는 판매소가 없어요."
      getAddress={(s) => s.소재지도로명주소 || s.소재지지번주소 || ""}
      getSearchText={(s) => `${s.판매소명} ${s.소재지도로명주소 || s.소재지지번주소 || ""}`}
      renderItem={(s) => (
        <>
          <p className="break-words text-base font-bold text-zinc-900">
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
          <p className="mt-1 break-words text-sm text-zinc-500">
            {s.소재지도로명주소 || s.소재지지번주소}
            {s.전화번호 ? ` · ${s.전화번호}` : ""}
          </p>
        </>
      )}
    />
  );
}
