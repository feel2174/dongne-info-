// zucca100 "우리동네" 묶음의 형제 사이트로 가는 교차 링크.
// 세 사이트(dongne-info·ewaste-info·parking-for-all)는 지역 키(시도/시군구)가 같아서
// 같은 지역 페이지로 바로 연결한다. 서버 렌더 <a>라 최초 HTML에 포함된다.
export const SIBLINGS = [
  {
    name: "우리동네 폐가전 수거함",
    url: "https://ewaste-info.zucca100.com",
    topic: "폐가전·폐휴대폰 수거함 위치",
  },
  {
    name: "우리동네 주차장 정보",
    url: "https://parking-for-all.zucca100.com",
    topic: "공영주차장·거주자우선주차구역",
  },
];

export default function SiblingSites({ sido, sigungu }: { sido: string; sigungu: string }) {
  const path = `/${encodeURIComponent(sido)}/${encodeURIComponent(sigungu)}`;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-green-dark break-keep">
        🏘️ {sido} {sigungu} 생활정보 더보기
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {SIBLINGS.map((s) => (
          <li key={s.url}>
            <a
              href={`${s.url}${path}`}
              className="block rounded-2xl border-2 border-green-light bg-white p-5 transition-colors hover:border-green"
            >
              <span className="block text-lg font-bold text-zinc-900 break-keep">
                {sigungu} {s.topic}
              </span>
              <span className="mt-1 block text-base text-zinc-500">{s.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
