# 생복갤 아카이브

생활복싱 마이너 갤러리의 **정보앨범 모음글에서 선정한 링크**를 검색하는 비공식 아카이브입니다.

- 제목·카테고리·수록 모음집 검색
- 장비 / 꿀팁 / 치료·재활 / 만화 필터
- 모음집별 필터 및 개별 DC 원문 바로가기
- 중복 없는 게시물 번호, 출처 모음글, 마지막 수동 갱신일 표시

## 콘텐츠 관리

운영자는 기존 DC 모음글에 링크를 추가합니다. 정기 수집은 없으며 필요할 때만 갱신합니다. 방문자 요청으로 DC를 호출하지 않으므로 사이트 조회 트래픽이 수집 요청을 늘리지 않습니다.

### GitHub에서 수동 갱신

이 워크플로가 기본 브랜치에 반영된 후:

1. **Actions → Refresh information album → Run workflow**를 선택합니다.
2. 완료 후 Summary의 비교 링크를 엽니다.
3. 새 링크와 `needs-review` / `unavailable` 상태를 확인하고 PR을 만들어 병합합니다.
4. Vercel에 연결된 `main`에 병합하면 운영 사이트가 자동으로 다시 배포됩니다.

실행 권한은 GitHub 저장소의 쓰기 권한이 있는 운영자에게 있습니다. 별도 관리자 비밀번호나 Google Sheets 인증키는 필요하지 않습니다.

### 로컬 갱신

Node.js 22.13 이상과 Python 3.12 이상을 사용합니다. 수집기는 Python 표준 라이브러리만 사용합니다.

```sh
python scripts/collect_album.py
python -m unittest discover -s tests -p test_album.py
```

결과는 `data/album.json`에 저장됩니다. 모음글 본문의 생활복싱(`bx`) 게시물 링크만 가져오고 광고·댓글·하단 게시판 목록은 제외합니다. 모바일·PC 주소를 게시물 번호로 통일합니다. 모음글·꿀팁 각 편·번역 시리즈만 최대 3단계로 확장하며 일반 사용기에 있는 다른 링크는 따라가지 않습니다.

새 글은 원문 제목을 확인합니다. 기존에 확인한 제목은 재사용합니다. 열리지 않는 새 글은 `unavailable`로 기록하며 공개 목록에서 제외합니다. 모음글 수집이 실패하면 기존 데이터 파일을 교체하지 않습니다. 목차에서 사라진 링크는 삭제하지 않고 `needs-review`로 남깁니다. 본문·댓글·이미지는 복제하지 않습니다.

`collections`는 수집한 목차와 링크 해시, `posts`는 제목·URL·분류·상위 목차·상태를 담습니다. `changes`에는 이번 실행에서 발견한 추가·확인 필요 항목이 기록됩니다. 이 날짜는 원문 작성일이 아니라 수집 확인일입니다.

## 개발과 배포

React 19 / TypeScript / Next.js App Router 기반이며 Vercel에 배포합니다. 현재 데이터는 빌드 시 JSON에서 읽으며 데이터베이스나 ChatGPT 로그인을 사용하지 않습니다.

```sh
npm ci
npm run dev
npm run build
```

Windows PowerShell에서는 `npm.cmd`, `npx.cmd`를 사용할 수 있습니다. `npm run dev`, `npm run build`, `npm test`도 지원합니다.

- `app/page.tsx`: 검색·필터·앨범 화면
- `app/globals.css`, `app/album.css`: 반응형 스타일
- `scripts/collect_album.py`: 수동 수집기
- `.github/workflows/refresh-album.yml`: 수동 실행 워크플로
- `vercel.json`: Vercel 프레임워크 설정
- `data/brands.json`: 브랜드명·제품명 표기 규칙
- `data/brand-reviews.json`: 원문 본문 검토로 보완한 브랜드 분류

브랜치에서 수정 → Vercel 미리보기 확인 → PR 검토 → `main` 병합 → Vercel 자동 운영 배포 순서로 진행합니다. API 키나 서비스 계정 파일은 커밋하지 않습니다. 기존 Sites 배포는 이전 버전으로 남아 있으며 이 브랜치에서 더 이상 갱신하지 않습니다.
