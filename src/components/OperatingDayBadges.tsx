// 주차장 데이터의 "운영요일"은 배출정보처럼 개별 요일(일/월/화...)이 아니라
// "평일+토요일+공휴일" 조합(6가지 경우의 수)이라 DayBadges와는 다른 카테고리를 씀.
const CATEGORIES = ["평일", "토요일", "공휴일"] as const;

export default function OperatingDayBadges({ value }: { value: string }) {
  const active = new Set(
    (value || "")
      .split("+")
      .map((d) => d.trim())
      .filter((d) => (CATEGORIES as readonly string[]).includes(d))
  );

  if (active.size === 0) {
    return <span className="text-zinc-700">{value || "운영 정보 없음"}</span>;
  }

  return (
    <span className="inline-flex gap-1">
      {CATEGORIES.map((cat) => (
        <span
          key={cat}
          className={
            active.has(cat)
              ? "rounded-full bg-green px-2 py-0.5 text-xs font-bold text-white"
              : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-300"
          }
        >
          {cat}
        </span>
      ))}
    </span>
  );
}
