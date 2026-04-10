# npx 지원 및 npm 배포 설계

**날짜:** 2026-04-11  
**패키지명:** `local-bookmark-dash`

## 목표

기존 dashboard 앱을 `npx local-bookmark-dash` 명령으로 즉시 실행 가능하도록 만들고, npm에 배포한다.

## 파일 구조

```
dashboard/
├── bin/
│   └── cli.js          # npx 진입점 (신규)
├── dist/               # 빌드된 정적 파일 (npm 패키지에 포함)
├── json/               # 로컬 개발용 북마크 데이터
├── server.js           # 기존 개발 서버 (변경 없음)
└── package.json        # 수정 필요
```

## package.json 변경사항

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| `name` | `"dashboard"` | `"local-bookmark-dash"` |
| `private` | `true` | 제거 |
| `bin` | 없음 | `{ "local-bookmark-dash": "./bin/cli.js" }` |
| `files` | 없음 | `["bin", "dist", "json"]` |
| `main` | 없음 | `"bin/cli.js"` |
| `engines` | 없음 | `{ "node": ">=16" }` |
| `keywords` | 없음 | `["dashboard", "bookmarks", "local", "npx"]` |

## bin/cli.js 동작 흐름

1. `process.cwd()/json/` 폴더 확인
2. `json/dashboard.json` 없으면 기본 북마크 파일 자동 생성
3. 포트 1234로 HTTP 서버 시작
4. 정적 파일(HTML/JS/CSS)은 패키지의 `dist/` 폴더에서 서빙 (`path.join(__dirname, '../dist')`)
5. `.json` 요청은 `process.cwd()/json/`에서 서빙
6. 터미널에 `http://localhost:1234` 안내 출력

### 기본 생성 dashboard.json

```json
{
  "urls": [
    { "emoji": "🌐", "label": "Google", "url": "https://google.com" },
    { "emoji": "📚", "label": "GitHub", "url": "https://github.com" }
  ]
}
```

## 빌드 및 배포 흐름

```bash
# local.html도 빌드 대상에 포함
npm run build        # dist/ 생성
npm publish          # npm 배포
```

### build 스크립트 수정

현재 빌드는 `index.html`(editor mode)만 대상으로 하며 `--public-url /dashboard/`를 사용한다. npx 배포용으로는 `local.html`도 포함하고 `--public-url ./`로 변경해야 한다.

기존 `build` 스크립트(GitHub Pages용)는 그대로 유지하고, npm 배포용 스크립트를 별도로 추가한다:

```json
"build:npm": "parcel build index.html local.html --no-cache --public-url ./"
```

`--public-url ./`이유: npx 실행 시 `/dashboard/` 경로가 아닌 루트(`/`)에서 서빙하므로 상대경로가 필요하다.

## npm 패키지 포함/제외 항목

**포함 (`files` 필드):**
- `bin/` — CLI 스크립트
- `dist/` — 빌드된 정적 파일
- `json/` — 기본 북마크 샘플 (선택적)

**제외 (자동 제외 또는 .npmignore):**
- `src/`, `components/`, `hooks/`, `js/`, `types/` — 소스코드
- `node_modules/`, `.parcel-cache/`
- `server.js` — 개발 전용 서버
- 루트의 `index.html`, `local.html` — 개발용 템플릿

## 구현 체크리스트

- [ ] `bin/cli.js` 생성
- [ ] `package.json` 수정 (name, private, bin, files, main, engines, keywords)
- [ ] `build:npm` 스크립트 추가 (`local.html` 포함, `--public-url ./`)
- [ ] `npm run build` 실행 후 dist/ 확인
- [ ] 로컬에서 `node bin/cli.js` 동작 검증
- [ ] `npm publish` 실행
- [ ] README 업데이트 (npx 사용법 추가)
