# 열린 연구노트

논문 리뷰와 연구노트를 한국어·영어로 공개하기 위한 Astro 기반 정적 블로그입니다. 공개 사이트는 GitHub Pages에 배포되며, 글 작성기와 파일 저장 기능은 로컬 개발 환경에서만 나타납니다.

## 처음 실행하기

```powershell
pnpm install
pnpm dev --background
```

개발 서버가 표시한 주소 뒤에 `/editor/`를 붙이면 로컬 글 작성기가 열립니다. 예: `http://localhost:4321/editor/`

Docker를 사용할 때는 별도의 Node.js 설치 없이 다음 명령으로 같은 개발 환경을 실행할 수 있습니다.

```powershell
docker compose up -d --build --wait dev
```

블로그는 `http://localhost:4321/`, 작성기는 `http://localhost:4321/editor/`에서 열립니다.

## 언어 정책

블로그의 기본 언어는 모든 방문자에게 영어입니다. 브라우저 언어와 이전 언어 선택을 저장하지 않으므로 사이트 루트로 다시 방문하면 항상 영어로 시작합니다. 상단 언어 선택 메뉴에서 `한국어`를 직접 선택한 경우에만 현재 방문 중인 페이지를 한국어로 볼 수 있습니다.

## 글을 작성하고 공개하는 순서

1. 로컬 글 작성기에서 새 글을 선택합니다.
2. slug와 카테고리를 선택합니다. 새 글이면 카테고리에 맞는 한영 Markdown 양식이 자동으로 들어갑니다.
3. 태그를 필요한 만큼 선택하고 한국어·영어 제목·요약·본문을 입력합니다.
4. 필요하면 이미지를 선택하고 대체 텍스트와 함께 본문에 삽입합니다.
5. `미리보기 확인`을 눌러 실제 글 스타일과 Mermaid 다이어그램을 확인합니다.
6. `Markdown 파일 저장`을 누릅니다. 미리보기 이후 내용이 바뀌었다면 다시 확인해야 저장할 수 있습니다.
7. 로컬 공개 화면에서 한국어·영어 글을 마지막으로 확인합니다.
8. 변경 파일을 Git에 커밋하고 `main` 브랜치에 push합니다.

GitHub Actions가 이미지 경로와 대체 텍스트, 한·영 파일 구조를 검사한 뒤 GitHub Pages에 자동 배포합니다. 이미지가 누락되면 배포가 중단됩니다.

## 게시물 파일 구조

```text
src/content/posts/my-post/
├─ ko.md
├─ en.md
└─ images/
   └─ figure-1.png
```

두 Markdown 파일은 같은 단일 카테고리와 태그 목록을 사용합니다.

`src/content/posts/_watch.md`는 게시물이 하나도 없을 때도 Astro가 첫 게시물 생성을 즉시 감지하도록 유지하는 내부 파일입니다. 글 목록에는 나타나지 않으며 삭제하지 않습니다.

```yaml
---
title: 게시물 제목
summary: 게시물 요약
category: paper-reviews
tags:
  - accessibility
  - machine-learning
draft: true
---
```

이미지는 다음과 같이 상대 경로로 작성합니다.

```markdown
![실험 결과를 비교한 막대그래프](./images/figure-1.png)
```

대체 텍스트는 비워 둘 수 없습니다. 외부 이미지 주소는 허용하지만, 불러오기에 실패하면 공개 글에서 파일 주소와 대체 텍스트가 포함된 오류 안내가 나타납니다.

## 작성일과 수정일

- 작성일: 해당 게시물 폴더가 처음 커밋된 시각
- 수정일: 해당 게시물 폴더를 가장 최근에 수정한 커밋 시각
- 커밋이 한 번뿐이면 수정일은 표시하지 않습니다.

배포 작업은 전체 Git 기록을 가져오므로 GitHub Pages에서도 날짜를 정확히 계산합니다. 아직 커밋하지 않은 로컬 초안은 미리보기를 위해 파일 수정 시각을 임시로 사용합니다.

## 카테고리 관리

로컬 글 작성기 아래쪽의 `카테고리 추가·수정·삭제` 영역에서 관리합니다. 기본 카테고리는 다음과 같습니다.

- 논문 리뷰 / Paper Reviews
- 연구노트 / Research Notes

사용 중인 카테고리는 해당 글에서 먼저 제외해야 삭제할 수 있습니다.

게시물은 카테고리를 정확히 하나만 가집니다. 카테고리 이름은 한국어와 영어로 나뉘지만 게시물 내부에는 공통 ID 하나만 저장됩니다.

## 태그 관리와 검색

태그는 한영 구분 없이 하나의 고유 키워드로 사용합니다. 작성기의 태그 입력란에서 기존 태그를 검색해 선택하거나 새 태그를 만들 수 있으며, 아래쪽 `태그 추가·수정·삭제` 영역에서도 관리할 수 있습니다.

태그 저장소는 `src/data/tags.json`입니다. 영문은 소문자로 정규화되고 단어 사이는 하이픈으로 연결합니다. 검색 화면에서 여러 태그를 고르면 선택한 태그를 모두 포함하는 게시물만 표시됩니다.

## 카테고리별 작성 양식

새 글에서 `논문 리뷰` 또는 `연구노트`를 선택하면 다음 파일의 한국어·영어 양식을 불러옵니다.

```text
src/content/templates/
├─ paper-reviews/
│  ├─ ko.md
│  └─ en.md
└─ research-notes/
   ├─ ko.md
   └─ en.md
```

논문 리뷰 양식은 학생이 논문의 큰 그림, 핵심 아이디어, 결과와 배운 점을 가볍게 기록하도록 구성했습니다. 설계에는 University of Waterloo의 [S. Keshav, How to Read a Paper](https://cs.uwaterloo.ca/~Brecht/courses/856/readings/how-to-read/keshav-paper-reading.pdf)의 단계적 읽기와 핵심 기여 파악 원칙을 참고했습니다.

연구노트 양식은 목적, 진행 과정, 관찰·결과, 해석과 다음 단계를 남기도록 구성했습니다. [NCBI의 책임 있는 연구 기록 지침](https://www.ncbi.nlm.nih.gov/books/NBK236192/)과 [PLOS의 계산 연구노트 지침](https://pmc.ncbi.nlm.nih.gov/articles/PMC4565690/)에서 강조하는 날짜순 기록, 맥락, 절차, 결과와 다음 행동 원칙을 참고했습니다.

양식 파일을 직접 고치면 이후 작성하는 새 글부터 변경된 내용이 사용됩니다.

## Docker 실행

macOS에서는 먼저 Docker Desktop을 실행하고 엔진이 준비될 때까지 기다립니다. Apple Silicon에서는 Linux ARM64 이미지와 의존성을 자동으로 사용하므로 Rosetta나 Mac용 Node.js/pnpm 설치가 필요하지 않습니다.

개발 환경과 로컬 작성기:

```sh
docker compose up -d --build --wait dev
```

블로그: `http://localhost:4321/` · 작성기: `http://localhost:4321/editor/`

상태·로그 확인과 종료:

```sh
docker compose ps
docker compose exec dev pnpm astro dev status
docker compose exec dev pnpm astro dev logs
docker compose logs -f dev
docker compose stop dev
```

다시 시작할 때는 `docker compose up -d --wait dev`를 실행합니다. 컨테이너 안에서는 `astro dev --background`로 실행하며, 컨테이너를 종료하면 `astro dev stop`으로 서버도 종료합니다. 개발 포트는 이 컴퓨터의 localhost에만 연결됩니다.

Windows에서 가져온 `node_modules`와 `.astro`는 컨테이너의 별도 볼륨으로 분리됩니다. 소스와 작성한 글은 프로젝트 폴더에 그대로 저장됩니다. 패키지나 잠금 파일을 수정했다면 실행 중인 서버를 멈춘 다음 Linux 의존성을 갱신합니다.

```sh
docker compose stop dev
docker compose build dev
docker compose run --rm --no-deps dev pnpm install --frozen-lockfile
docker compose up -d --wait dev
```

공개용 정적 결과를 Nginx에서 확인하려면 다음 명령을 사용합니다.

```powershell
docker compose --profile production up public --build
```

공개 미리보기는 `http://localhost:8080/`에서 열립니다. 다른 주소나 하위 경로가 필요하면 `SITE_URL`과 `BASE_PATH` 환경 변수를 지정할 수 있습니다. 작성일과 수정일을 정확히 계산하려면 얕은 복제가 아닌 전체 Git 기록이 필요합니다. 최종 공개 컨테이너에는 Git 기록, 로컬 작성기, 파일 저장 API가 포함되지 않습니다.

## 블로그 이름과 소개 변경

블로그 이름, 소개, 작성자 표시는 `src/config/site.ts` 한 파일에서 변경합니다. 현재 작성자는 임시값 `Your Name`으로 되어 있습니다.

## 배포 설정

저장소를 GitHub에 올린 뒤 `Settings → Pages → Build and deployment → Source`에서 `GitHub Actions`를 선택합니다.

설정 파일은 저장소 이름을 자동 판별합니다.

- `<사용자명>.github.io` 저장소: `https://<사용자명>.github.io/`
- 일반 저장소: `https://<사용자명>.github.io/<저장소명>/`

검색엔진용 `robots.txt`, sitemap, RSS 피드도 빌드할 때 자동 생성됩니다.

## 품질 검사

```powershell
pnpm check
pnpm build
pnpm validate:utf8
```

검사 과정은 모든 소스와 공개 결과물이 올바른 UTF-8인지 확인하며, 손상된 대체 문자나 물음표 3개 이상의 연속이 발견되면 실패합니다. `pnpm build` 결과에는 `/editor/`와 `/api/local/`이 포함되지 않습니다.
