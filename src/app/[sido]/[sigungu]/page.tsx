import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllRegionSummaries, getRegionData } from "@/lib/regions";
import { sidoAlias } from "@/lib/sidoAlias";
import BagStoreList from "@/components/BagStoreList";
import WasteInfoList from "@/components/WasteInfoList";
import ParkingSection from "@/components/ParkingSection";

export async function generateStaticParams() {
  return getAllRegionSummaries().map((r) => ({
    sido: r.sido,
    sigungu: r.sigungu,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sido: string; sigungu: string }>;
}): Promise<Metadata> {
  const raw = await params;
  const sido = decodeURIComponent(raw.sido);
  const sigungu = decodeURIComponent(raw.sigungu);
  const data = getRegionData(sido, sigungu);
  if (!data) return { title: "지역 정보 없음" };

  const alias = sidoAlias(sido);
  const aliasSuffix = alias ? `(${alias})` : "";

  const title = `${sido}${aliasSuffix} ${sigungu} 재활용 쓰레기 버리는 날 · 종량제봉투 · 주차장 정보`;
  const description = `${sido}${aliasSuffix} ${sigungu}의 생활쓰레기·음식물쓰레기·재활용품 배출 요일과 시간, 종량제봉투 판매소, 공영·민영 주차장, 거주자우선주차구역 정보를 한눈에 확인하세요.`;
  const keywords = [
    `${sido} ${sigungu} 종량제봉투`,
    `${sido} ${sigungu} 종량제봉투 파는곳`,
    `${sido} ${sigungu} 재활용 쓰레기 버리는 날`,
    `${sido} ${sigungu} 공영주차장`,
    `${sido} ${sigungu} 거주자우선주차`,
    ...(alias
      ? [
          `${alias} ${sigungu} 종량제봉투`,
          `${alias} ${sigungu} 종량제봉투 파는곳`,
          `${alias} ${sigungu} 재활용 쓰레기 버리는 날`,
          `${alias} ${sigungu} 공영주차장`,
          `${alias} ${sigungu} 거주자우선주차`,
        ]
      : []),
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/${sido}/${sigungu}` },
    openGraph: { title, description, locale: "ko_KR", type: "website" },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ sido: string; sigungu: string }>;
}) {
  const raw = await params;
  const sido = decodeURIComponent(raw.sido);
  const sigungu = decodeURIComponent(raw.sigungu);
  const data = getRegionData(sido, sigungu);
  if (!data) notFound();

  const wasteInfo = data.waste_info ?? [];
  const bagStores = data.bag_stores ?? [];
  const parking = data.parking ?? [];
  const residentParking = data.resident_parking ?? [];
  const openBagStores = bagStores.filter((s) => s.영업상태명 === "영업");
  const alias = sidoAlias(sido);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-4 text-base font-medium text-zinc-500">
        <a href="/" className="text-green-dark hover:underline">
          우리동네 정보
        </a>{" "}
        / {sido} / {sigungu}
      </nav>

      <div className="rounded-2xl bg-green px-6 py-6 text-white">
        <h1 className="text-2xl font-extrabold sm:text-3xl">
          {sido} {sigungu}
        </h1>
        <p className="mt-1 text-lg text-green-light">
          {alias ? `${alias} ${sigungu} ` : ""}재활용 쓰레기 버리는 날 · 종량제봉투 파는 곳
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-green-dark">🗓️ 쓰레기 배출 정보</h2>
        {wasteInfo.length === 0 ? (
          <p className="mt-3 rounded-xl bg-white p-4 text-lg text-zinc-500">
            아직 등록된 배출 정보가 없습니다.
          </p>
        ) : (
          <div className="mt-4">
            <WasteInfoList items={wasteInfo} />
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-green-dark">
          🛍️ 종량제봉투 판매소{" "}
          <span className="text-lg font-medium text-zinc-500">
            ({openBagStores.length}곳 영업 중 / 전체 {bagStores.length}곳)
          </span>
        </h2>
        {bagStores.length === 0 ? (
          <p className="mt-3 rounded-xl bg-white p-4 text-lg text-zinc-500">
            아직 등록된 판매소 정보가 없습니다.
          </p>
        ) : (
          <BagStoreList stores={bagStores} />
        )}
      </section>

      <ParkingSection parking={parking} residentParking={residentParking} />
    </main>
  );
}
