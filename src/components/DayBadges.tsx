const ALL_DAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export default function DayBadges({ dow }: { dow: string }) {
  const activeDays = new Set(
    dow
      .split("+")
      .map((d) => d.trim())
      .filter((d) => (ALL_DAYS as readonly string[]).includes(d))
  );

  // 파싱 가능한 요일이 하나도 없으면(매일/공휴일 등 특수 표기) 원문 그대로 표시
  if (activeDays.size === 0) {
    return <span className="text-zinc-700">{dow}</span>;
  }

  return (
    <span className="inline-flex gap-1">
      {ALL_DAYS.map((day) => (
        <span
          key={day}
          className={
            activeDays.has(day)
              ? "flex h-7 w-7 items-center justify-center rounded-full bg-green text-sm font-bold text-white"
              : "flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-300"
          }
        >
          {day}
        </span>
      ))}
    </span>
  );
}
