import { getAllRegionSummaries } from "@/lib/regions";
import KoreaMap from "@/components/KoreaMap";

// 시도를 화면에 노출할 때 쓰는 자연스러운 순서(수도권·광역시 우선).
// 목록에 없는 시도는 뒤에 가나다순으로 붙는다.
const SIDO_ORDER = [
  "서울특별시",
  "경기도",
  "인천광역시",
  "부산광역시",
  "대구광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

export default function Home() {
  const regions = getAllRegionSummaries();

  // 시도별로 묶어서 서버에서 실제 <a> 링크로 렌더한다. 지도/검색은 클릭 후에야
  // 링크가 생기기 때문에, 크롤러가 최초 HTML에서 하위 상세페이지를 발견할 수
  // 있도록 아래 "전체 지역 바로가기" 디렉토리를 함께 내려준다(패턴 B 링크 디스커버리).
  const bySido = new Map<string, typeof regions>();
  for (const r of regions) {
    if (!bySido.has(r.sido)) bySido.set(r.sido, []);
    bySido.get(r.sido)!.push(r);
  }
  const sidoList = [...bySido.keys()].sort((a, b) => {
    const ia = SIDO_ORDER.indexOf(a);
    const ib = SIDO_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b, "ko");
  });

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

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-green-dark">전체 지역 바로가기</h2>
        <p className="mt-2 text-base text-zinc-500">
          전국 {regions.length}개 시군구의 쓰레기 배출 요일·종량제봉투 판매소 정보를
          제공합니다. 지역을 눌러 해당 페이지로 이동하세요.
        </p>

        <div className="mt-4 space-y-2">
          {sidoList.map((sido) => {
            const list = [...bySido.get(sido)!].sort((a, b) =>
              a.sigungu.localeCompare(b.sigungu, "ko"),
            );
            return (
              <details
                key={sido}
                className="overflow-hidden rounded-xl border-2 border-yellow bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-lg font-bold text-zinc-900 hover:bg-yellow-light/40">
                  <span>{sido}</span>
                  <span className="text-base font-medium text-zinc-500">
                    {list.length}개 시군구
                  </span>
                </summary>
                <ul className="grid grid-cols-2 gap-2 border-t-2 border-yellow-light p-4 sm:grid-cols-3">
                  {list.map((r) => (
                    <li key={r.sigungu}>
                      <a
                        href={`/${encodeURIComponent(r.sido)}/${encodeURIComponent(r.sigungu)}`}
                        className="block rounded-lg bg-yellow-light px-3 py-2 text-center text-base font-semibold text-green-dark hover:bg-yellow"
                      >
                        {r.sigungu}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      </section>
    </main>
  );
}
