# 네이버 서치어드바이저 제출 체크리스트

콘솔: https://searchadvisor.naver.com/console/board
사이트: `https://dongne-info.zucca100.com`

> **순서를 지킬 것 — 배포 → 200 확인 → 제출.**
> 아직 배포되지 않은 URL(`/rss.xml`)을 먼저 제출하면 수집 실패로 기록되고
> 재제출까지 시간이 걸린다.

---

## 0. 배포 전 확인 (이미 완료)

| 항목 | 상태 |
| --- | --- |
| Yeti(네이버 봇) 접근 | 200 — 일반 UA와 동일 응답, 차단·클로킹 없음 |
| `robots.txt` | 200, `User-Agent: *` / `Allow: /` → Yeti·Daumoa 허용 |
| `sitemap.xml` | 200, URL 239개 |
| `rss.xml` | **이번 작업으로 신규 생성** (배포 후 200 확인 필요) |
| `<meta name="naver-site-verification">` | `src/app/layout.tsx`에 존재 (`5aaf6458...`) |

## 1. 소유확인 — 가장 흔한 누락 지점

메타태그가 HTML에 들어 있는 것만으로는 등록이 완료되지 않는다.
서치어드바이저 콘솔에서 **[웹마스터 도구] > 사이트 등록 > 소유확인** 버튼을
실제로 눌러야 한다. 아직 안 눌렀다면 아래 단계는 전부 무의미하다.

- 이 사이트가 콘솔에 등록돼 있는지 먼저 확인
- 미등록이면 `https://dongne-info.zucca100.com` 등록 → HTML 메타태그 방식 선택
- 콘솔이 발급한 값이 `layout.tsx`의 값과 **다르면** `layout.tsx`를 콘솔 값으로 교체
  (인증값은 사이트마다 고유 — 다른 프로젝트 값을 복사해 쓰면 소유확인이 실패한다)

## 2. 사이트맵 / RSS 제출

**요청 > 사이트맵 제출**, **요청 > RSS 제출**

입력란에는 **전체 URL이 아니라 경로만** 넣는다. 도메인은 이미 등록돼 있으므로
전체 URL을 넣으면 중복 경로로 실패한다.

| 메뉴 | 입력값 |
| --- | --- |
| 사이트맵 제출 | `sitemap.xml` |
| RSS 제출 | `rss.xml` |

네이버는 사이트맵과 RSS를 **별개 수집 경로**로 취급하므로 둘 다 제출한다.

## 3. 수동 수집요청 (요청 > 웹페이지 수집)

하루 요청 수에 제한이 있으므로 검색 수요가 큰 순서로 넣는다.
아래는 전부 **라이브에서 200 확인 완료**(2026-09-04 기준).

| # | URL | 코드 |
| --- | --- | --- |
| 1 | `https://dongne-info.zucca100.com/` | 200 |
| 2 | `https://dongne-info.zucca100.com/경기도/성남시` | 200 |
| 3 | `https://dongne-info.zucca100.com/서울특별시/강서구` | 200 |
| 4 | `https://dongne-info.zucca100.com/서울특별시/관악구` | 200 |
| 5 | `https://dongne-info.zucca100.com/서울특별시/마포구` | 200 |
| 6 | `https://dongne-info.zucca100.com/인천광역시/서구` | 200 |
| 7 | `https://dongne-info.zucca100.com/인천광역시/중구` | 200 |
| 8 | `https://dongne-info.zucca100.com/경기도/의정부시` | 200 |
| 9 | `https://dongne-info.zucca100.com/경기도/남양주시` | 200 |
| 10 | `https://dongne-info.zucca100.com/경기도/안성시` | 200 |
| 11 | `https://dongne-info.zucca100.com/부산광역시/해운대구` | 200 |
| 12 | `https://dongne-info.zucca100.com/부산광역시/수영구` | 200 |
| 13 | `https://dongne-info.zucca100.com/대구광역시/중구` | 200 |
| 14 | `https://dongne-info.zucca100.com/대전광역시/서구` | 200 |
| 15 | `https://dongne-info.zucca100.com/광주광역시/광산구` | 200 |
| 16 | `https://dongne-info.zucca100.com/광주광역시/북구` | 200 |
| 17 | `https://dongne-info.zucca100.com/울산광역시/울주군` | 200 |
| 18 | `https://dongne-info.zucca100.com/경상남도/진주시` | 200 |
| 19 | `https://dongne-info.zucca100.com/강원특별자치도/춘천시` | 200 |
| 20 | `https://dongne-info.zucca100.com/강원특별자치도/강릉시` | 200 |
| 21 | `https://dongne-info.zucca100.com/충청북도/충주시` | 200 |
| 22 | `https://dongne-info.zucca100.com/전북특별자치도/익산시` | 200 |

한글 URL 그대로 붙여넣어도 되고, 퍼센트 인코딩된 형태여도 된다.

## 4. 제출하면 안 되는 URL

| URL | 코드 | 이유 |
| --- | --- | --- |
| `/favicon.ico` | 200 | `robots.txt`에서 `Disallow` — 수집 거부로 기록된다 |
| `https://dongne-info.vercel.app/` | 200 | 커스텀 도메인과 **중복 도메인**. canonical은 `zucca100.com`을 가리키지만 서치어드바이저에는 커스텀 도메인만 등록·제출할 것 |
| `/서울특별시/강동구` | 200 | 데이터 0건 — 빈 페이지 (아래 참고) |
| `/서울특별시/도봉구` | 200 | 데이터 0건 |
| `/충청북도/청주시` | 200 | 데이터 0건 |
| `/세종특별자치시/세종특별자치시` | 200 | 데이터 0건 |
| `/강원특별자치도/속초시` | 200 | 데이터 0건 |
| `/강원특별자치도/화천군` | 200 | 데이터 0건 |
| `/전북특별자치도/남원시` | 200 | 데이터 0건 |
| `/충청남도/공주시` | 200 | 데이터 0건 |
| `/충청남도/예산군` | 200 | 데이터 0건 |
| `/경기도/남양주` | 200 | `/경기도/남양주시`와 같은 지역이 두 페이지로 쪼개져 있음 (아래 참고) |
| `/경기도/동두천` | 200 | `/경기도/동두천시`와 중복 |

리다이렉트되는 URL은 현재 없다. (Vercel에서 `"permanent": true`를 쓰면 301이
아니라 **308**을 반환하니, 나중에 리다이렉트를 추가하면 그 URL은 제출 대상에서 뺄 것)

## 5. 배포 후 라이브 검증

```bash
SITE="https://dongne-info.zucca100.com"
curl -sI "$SITE/rss.xml" | grep -iE "^(http/|content-type)"
#  → HTTP/2 200 / content-type: application/rss+xml; charset=utf-8
curl -s "$SITE/rss.xml" -o /tmp/live-rss.xml
python3 -c "import xml.dom.minidom as m;d=m.parse('/tmp/live-rss.xml');print('items:',len(d.getElementsByTagName('item')))"
#  → items: 229
curl -s "$SITE/robots.txt" | grep -i sitemap
#  → sitemap.xml, rss.xml 두 줄
```

---

## RSS 피드에 대해 알아둘 것

- `src/app/rss.xml/route.ts`가 빌드 시점에 생성한다 (`dynamic = "force-static"`).
  데이터가 바뀌면 재배포만 하면 피드도 갱신된다.
- `title`/`description`은 실제 페이지 메타데이터와 같은 함수(`src/lib/site.ts`의
  `regionTitle`/`regionDescription`)에서 나온다 — 한쪽만 바뀌어 어긋날 일이 없다.
- 데이터 0건인 지역 9곳은 피드에서 제외된다 (229건). `sitemap.xml`에는 그대로
  남아 있다.
- `pubDate`는 `route.ts`의 `CONTENT_PUBLISHED_AT` 고정값이다. **데이터를 새로
  수집해 반영할 때만 이 값을 갱신할 것.** 배포 시각을 쓰면 코드만 고친 배포에도
  229건 전체가 "새 글"로 보여 잘못된 신선도 신호를 준다.

## 기대치

기술 세팅은 필요조건이지 충분조건이 아니다. 네이버 통합검색은
파워링크 → 스마트블록/VIEW(블로그·카페) → 지식iN 순으로 지면이 채워지고
웹문서 영역의 노출 지분은 작다. "종량제봉투 파는곳" 같은 상업성 키워드의
첫 화면 진입은 이 작업만으로는 어렵다.

- 수집 → 색인 → 노출은 각각 다른 단계다. 수집 성공이 곧 노출이 아니다.
- 신규 사이트는 검색 반영까지 통상 **2~4주**.
- 실제 유입의 본체는 네이버 블로그·지식iN 쪽이다. 지역별 글을 블로그에 쓰고
  본문에서 해당 지역 페이지로 링크하는 병행 전략을 권한다.
