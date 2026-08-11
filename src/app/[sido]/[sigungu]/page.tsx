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
          재활용 쓰레기 버리는 날 · 종량제봉투 파는 곳
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-green-dark">🗓️ 쓰레기 배출 정보</h2>
        {wasteInfo.length === 0 ? (
          <p className="mt-3 rounded-xl bg-white p-4 text-lg text-zinc-500">
            아직 등록된 배출 정보가 없습니다.
          </p>
        ) : (
          <div className="mt-4 space-y-5">
            {wasteInfo.map((w, i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-yellow bg-white p-5 shadow-sm"
              >
                {w.MNG_ZONE_TRGT_RGN_NM && w.MNG_ZONE_TRGT_RGN_NM !== "없음" && (
                  <p className="mb-3 inline-block rounded-full bg-yellow-light px-3 py-1 text-base font-bold text-yellow-dark">
                    적용 구역: {w.MNG_ZONE_TRGT_RGN_NM}
                  </p>
                )}
                <p className="text-base text-zinc-500">
                  배출 방식: {w.EMSN_PLC_TYPE} ({w.EMSN_PLC})
                </p>
                <dl className="mt-4 grid gap-3 text-lg">
                  <div className="rounded-lg bg-green-light px-4 py-3">
                    <dt className="inline font-bold text-green-dark">🟢 일반쓰레기</dt>
                    <dd className="inline text-zinc-800">
                      {" "}
                      {w.LF_WST_EMSN_DOW} {w.LF_WST_EMSN_BGNG_TM}~{w.LF_WST_EMSN_END_TM}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-yellow-light px-4 py-3">
                    <dt className="inline font-bold text-yellow-dark">🟡 음식물쓰레기</dt>
                    <dd className="inline text-zinc-800">
                      {" "}
                      {w.FOD_WST_EMSN_DOW} {w.FOD_WST_EMSN_BGNG_TM}~{w.FOD_WST_EMSN_END_TM}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-green-light px-4 py-3">
                    <dt className="inline font-bold text-green-dark">♻️ 재활용품</dt>
                    <dd className="inline text-zinc-800">
                      {" "}
                      {w.RCYCL_EMSN_DOW} {w.RCYCL_EMSN_BGNG_TM}~{w.RCYCL_EMSN_END_TM}
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
                    <span className="font-bold text-zinc-700">문의:</span> {w.MNG_DEPT_NM}{" "}
                    {w.MNG_DEPT_TELNO}
                  </p>
                )}
              </div>
            ))}
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
          <ul className="mt-4 divide-y-2 divide-yellow-light rounded-2xl border-2 border-yellow bg-white">
            {bagStores.map((s, i) => (
              <li key={i} className="px-5 py-4">
                <p className="text-lg font-bold text-zinc-900">
                  {s.판매소명}{" "}
                  <span
                    className={
                      s.영업상태명 === "영업"
                        ? "ml-1 rounded-full bg-green-light px-2 py-0.5 text-sm font-bold text-green-dark"
                        : "ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-sm font-bold text-zinc-400"
                    }
                  >
                    {s.영업상태명}
                  </span>
                </p>
                <p className="mt-1 text-base text-zinc-500">
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
