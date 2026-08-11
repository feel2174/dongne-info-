import { getAllRegionSummaries } from "@/lib/regions";
import RegionSearch from "@/components/RegionSearch";

export default function Home() {
  const regions = getAllRegionSummaries().sort((a, b) =>
    `${a.sido}${a.sigungu}`.localeCompare(`${b.sido}${b.sigungu}`, "ko")
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        우리동네 생활정보
      </h1>
      <p className="mt-2 text-zinc-500">
        우리 동네 재활용 쓰레기 버리는 날, 종량제봉투 파는 곳을 검색해보세요.
      </p>

      <RegionSearch regions={regions} />
    </main>
  );
}
