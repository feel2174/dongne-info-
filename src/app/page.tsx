import { getAllRegionSummaries } from "@/lib/regions";
import KoreaMap from "@/components/KoreaMap";

export default function Home() {
  const regions = getAllRegionSummaries();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl bg-green px-6 py-8 text-center text-white">
        <h1 className="text-3xl font-extrabold sm:text-4xl">우리동네 생활정보</h1>
        <p className="mt-3 text-lg text-green-light sm:text-xl">
          재활용 쓰레기 버리는 날, 종량제봉투 파는 곳을 지도에서 찾아보세요
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-center text-2xl font-bold text-green-dark">
          지역을 눌러보세요
        </h2>
        <div className="mt-4">
          <KoreaMap regions={regions} />
        </div>
      </div>
    </main>
  );
}
