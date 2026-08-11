# dongne-info

`local-data-pipeline`에서 수집한 공공데이터로 만든 "우리동네 생활정보" 사이트.
니치 키워드 전략 6번(지역 밀착형 생활 정보)의 결과물 — 지역명으로 검색하면
재활용 쓰레기 배출 요일/시간, 종량제봉투 판매소를 보여준다.

Next.js 16 (App Router) + Tailwind 4. `../blog-sitemap`과 동일한 스택으로
맞춤 (zucca100.com 운영 방식과 일관성 유지).

## 현재 상태
- 239개 지역 페이지 정적 생성 완료 (`npm run build`로 확인함, 244페이지 SSG)
- 데이터: 종량제봉투 판매소 22,916건 + 생활쓰레기 배출정보 10,187건
- 홈에서 지역명 검색 → 지역 페이지로 이동, 지도 없이 텍스트 검색만으로 동작
- sitemap.xml 자동 생성 (지역 239개 URL 전부 포함)

## 개발
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 정적 페이지 244개 생성 확인용
```

## 데이터 갱신
데이터는 `../local-data-pipeline`(별도 파이썬 프로젝트)에서 수집한 걸
`data/by_region/`에 복사해서 씀. 파이프라인 쪽에서 새로 수집했으면:
```bash
npm run sync-data   # ../local-data-pipeline/data/by_region를 복사해옴
npm run build        # 정적 페이지 재생성
```
배포 환경(Vercel 등)은 이 프로젝트만 보고 빌드하므로 `data/`는 git에 커밋해서
가져가야 함 — sync-data는 로컬에서 최신화할 때만 쓰는 스크립트.

## ⚠️ Next.js 16 관련 이슈 (겪은 것 기록)
동적 라우트(`app/[sido]/[sigungu]/page.tsx`)에서 한글 세그먼트를 쓸 때,
`params`로 넘어오는 값이 **자동으로 URL-디코딩되지 않고 퍼센트 인코딩된 상태
그대로** 넘어옴 (예: `경기도`가 아니라 `%EA%B2%BD%EA%B8%B0%EB%8F%84`).
이전 Next.js 버전 습관대로 짜면 지역을 못 찾아서 전부 404가 남 —
`src/lib/regions.ts`를 쓰는 곳(page.tsx, generateMetadata)에서 반드시
`decodeURIComponent(params.xxx)`를 거치도록 해뒀음. 새 동적 라우트를
추가할 때 이 패턴 재사용할 것.

## TODO (실제 배포 전)
- `src/app/layout.tsx`, `src/app/sitemap.ts`의 `SITE_URL`/`baseUrl`을
  실제 도메인으로 교체
- Google Analytics / AdSense / 네이버 서치어드바이저 인증 태그 추가
  (`../blog-sitemap/src/app/layout.tsx`에 zucca100.com용 설정이 있는데,
  GA 속성이나 네이버 인증은 도메인별로 새로 발급해야 해서 그대로 복붙하면 안 됨 —
  이 사이트 전용으로 새로 만들어야 함. AdSense 퍼블리셔 ID는 계정 단위라
  재사용 가능할 수 있음)
- 종량제봉투 판매소 리스트가 지역에 따라 300곳 넘게 나오는 곳도 있어서,
  트래픽 보고 페이지네이션/접기 UI 추가할지 판단할 것
- 3번째 채널(E-GEN 야간약국)은 후순위로 보류 중 (`../local-data-pipeline/sources/egen.py`)

## 구조
```
dongne-info/
  src/app/page.tsx                  # 홈 (지역 검색)
  src/app/[sido]/[sigungu]/page.tsx # 지역 상세 페이지 (SSG, SEO 메타데이터)
  src/app/sitemap.ts                # 사이트맵 자동 생성
  src/components/RegionSearch.tsx   # 클라이언트 검색 컴포넌트
  src/lib/regions.ts                # data/by_region JSON 읽기/파싱
  data/by_region/                   # local-data-pipeline에서 복사해온 데이터
```
