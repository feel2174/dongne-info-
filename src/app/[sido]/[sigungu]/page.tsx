import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllRegionSummaries, getRegionData } from "@/lib/regions";

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

  const title = `${sido} ${sigungu} 재활용 쓰레기 버리는 날 · 종량제봉투 파는 곳`;
  const description = `${sido} ${sigungu}의 생활쓰레기·음식물쓰레기·재활용품 배출 요일과 시간, 종량제봉투 판매소 위치를 한눈에 확인하세요.`;

  return {
    title,
    description,
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
  const openBagStores = bagStores.filter((s) => s.영업상태명 === "영업");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-6 text-sm text-zinc-500">
        <a href="/" className="hover:underline">
          우리동네 정보
        </a>{" "}
        / {sido} / {sigungu}
      </nav>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        {sido} {sigungu} 재활용 쓰레기 버리는 날 · 종량제봉투 파는 곳
      </h1>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          쓰레기 배출 정보
        </h2>
        {wasteInfo.length === 0 ? (
          <p className="mt-2 text-zinc-500">
            아직 등록된 배출 정보가 없습니다.
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {wasteInfo.map((w, i) => (
              <div
                key={i}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                {w.MNG_ZONE_TRGT_RGN_NM && w.MNG_ZONE_TRGT_RGN_NM !== "없음" && (
                  <p className="mb-2 text-sm font-medium text-zinc-500">
                    적용 구역: {w.MNG_ZONE_TRGT_RGN_NM}
                  </p>
                )}
                <p className="text-sm text-zinc-500">
                  배출 방식: {w.EMSN_PLC_TYPE} ({w.EMSN_PLC})
                </p>
                <dl className="mt-3 grid gap-2 text-sm">
                  <div>
                    <dt className="inline font-semibold">일반쓰레기</dt>
                    <dd className="inline">
                      {" "}
                      {w.LF_WST_EMSN_DOW} {w.LF_WST_EMSN_BGNG_TM}~{w.LF_WST_EMSN_END_TM}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold">음식물쓰레기</dt>
                    <dd className="inline">
                      {" "}
                      {w.FOD_WST_EMSN_DOW} {w.FOD_WST_EMSN_BGNG_TM}~{w.FOD_WST_EMSN_END_TM}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold">재활용품</dt>
                    <dd className="inline">
                      {" "}
                      {w.RCYCL_EMSN_DOW} {w.RCYCL_EMSN_BGNG_TM}~{w.RCYCL_EMSN_END_TM}
                    </dd>
                  </div>
                </dl>
                {w.UNCLLT_DAY && (
                  <p className="mt-3 text-sm text-zinc-500">
                    미수거일: {w.UNCLLT_DAY}
                  </p>
                )}
                {w.MNG_DEPT_NM && (
                  <p className="mt-1 text-sm text-zinc-500">
                    문의: {w.MNG_DEPT_NM} {w.MNG_DEPT_TELNO}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          종량제봉투 판매소 ({openBagStores.length}곳 영업 중 / 전체 {bagStores.length}곳)
        </h2>
        {bagStores.length === 0 ? (
          <p className="mt-2 text-zinc-500">
            아직 등록된 판매소 정보가 없습니다.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-zinc-200 dark:divide-zinc-800">
            {bagStores.map((s, i) => (
              <li key={i} className="py-3">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {s.판매소명}{" "}
                  <span
                    className={
                      s.영업상태명 === "영업"
                        ? "text-xs text-emerald-600"
                        : "text-xs text-zinc-400"
                    }
                  >
                    {s.영업상태명}
                  </span>
                </p>
                <p className="text-sm text-zinc-500">
                  {s.소재지도로명주소 || s.소재지지번주소}
                  {s.전화번호 ? ` · ${s.전화번호}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
