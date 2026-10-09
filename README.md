# Business Motion Websites

**사업의 전문성을 콘텐츠·이미지·영상·스크롤 모션으로 구현하는 AI 에이전트 스킬.**

멋진 첫 화면에서 끝나지 않고, 사업 이해부터 페이지 설계, 미디어 제작, 모바일 검증, 배포와 인수까지 연결합니다. 한국어 가이드를 중심으로 구성되어 있으며 특정 프레임워크·CMS·유료 공급자를 필수로 요구하지 않습니다.

## 제작 사례 — EVAS

**[EVAS 공식 홈페이지 · evas.co.kr](https://evas.co.kr)**

이 스킬을 활용한 홈페이지 제작 사례입니다. 실제 사이트에서 브랜드 표현과 콘텐츠 구성을 살펴보세요.

[사례 안내](examples/evas.md) · [스킬 본문](SKILL.md)

> 사례 사이트의 브랜드·문구·이미지·영상·소스 코드는 이 저장소의 배포 대상에 포함되지 않습니다. 새로운 사이트는 각 사업의 자료와 디자인 방향으로 제작합니다.

## 무엇을 하나요?

1. **사업 이해** — 고객, 구매 상황, 제공 범위와 입증 가능한 근거 정리.
2. **정보 설계** — 방문자의 질문에 맞춰 홈·상세·사례·문의의 역할 배정.
3. **아트 디렉션** — 타이포그래피, 레이아웃, 색상, 이미지와 모션 규칙 설계.
4. **실제 구현** — 대표 구간을 먼저 구현하고 공유 컴포넌트로 확장.
5. **미디어 제작** — 이미지, 브랜드 영상, 설명용 프리젠테이션, SVG 모션 연결.
6. **상호작용** — 스크롤, 재생 상태, 모바일 탐색과 모션 감소 처리.
7. **검증·공개** — 실제 화면, 최종 미디어, 문의 동작, 공개 URL과 운영 안내 확인.

## 설치

### Codex 로컬 스킬

Git이 설치된 터미널에서 실행합니다. 같은 이름의 폴더가 이미 있다면 기존 파일을 먼저 확인하세요. `git clone`은 기존의 비어 있지 않은 폴더를 덮어쓰지 않습니다.

```sh
mkdir -p ~/.codex/skills
git clone https://github.com/passeth/business-motion-websites.git ~/.codex/skills/business-motion-websites
```

설치 후 새 Codex 세션에서 `$business-motion-websites`를 호출하세요. 사용자 지정 스킬 경로를 쓰는 환경은 해당 경로에 설치합니다.

### 다른 AI 코딩 에이전트

이 저장소를 복제한 뒤 에이전트에 `SKILL.md`를 읽고 작업하도록 요청할 수 있습니다. 스킬 자동 검색을 지원하는 도구에서는 그 도구의 스킬 폴더에 저장소를 배치하세요. 자동 등록 방식은 도구마다 다릅니다.

```sh
git clone https://github.com/passeth/business-motion-websites.git
```

이 스킬은 실행 가능한 웹사이트 템플릿이 아니라 **에이전트용 제작 지침과 보조 자료**입니다. 실제 구현에는 파일 편집, 브라우저 검증 등 작업에 맞는 도구가 필요합니다.

## 사용 예시

```text
$business-motion-websites를 사용해 우리 회사 홈페이지를 만들어줘.

사업: [무엇을 제공하는 회사인지]
주 고객: [누가 어떤 상황에서 찾는지]
목표: [제품 탐색 / 상담 문의 / 브랜드 이해 등]
제공 자료: [소개서, 제품 정보, 사진, 실제 사례]
기존 사이트 또는 코드: [있으면 위치]
원하는 분위기: [브랜드 방향]
작업 범위: [기획, 구현, 미디어 제작, 배포 중 필요한 범위]

사업에 맞는 페이지 구성과 시각 방향을 정하고,
이미지·영상·스크롤 모션을 실제 화면으로 구현해줘.
모바일과 모션 감소 설정도 검증하고 확인하지 못한 항목은 구분해줘.
```

기존 사이트의 일부 개선에도 사용할 수 있습니다.

```text
$business-motion-websites로 기존 사이트의 제품 소개 구간을 개선해줘.
승인된 브랜드 디자인은 유지하고, 제품 설명과 모바일 탐색을 다듬어줘.
```

## 포함 파일

| 파일 | 역할 |
|---|---|
| [SKILL.md](SKILL.md) | 작업 범위와 전체 실행 흐름 |
| [business-content.md](references/business-content.md) | 사업 근거·페이지·사례·문의 설계 |
| [art-direction.md](references/art-direction.md) | 프로젝트별 디자인 방향과 토큰 |
| [media-production.md](references/media-production.md) | 이미지·영상·음성·프리젠테이션 제작 |
| [scroll-and-mobile.md](references/scroll-and-mobile.md) | 스크롤·재생 상태·모바일·접근성 |
| [verification-and-release.md](references/verification-and-release.md) | 화면 검증·검색 설정·배포·운영 인수 |
| [project-brief.md](assets/project-brief.md) | 복사해 채울 수 있는 프로젝트 브리프 |
| [audit-media.mjs](scripts/audit-media.mjs) | 로컬 미디어 메타데이터 검사 |
| [openai.yaml](agents/openai.yaml) | Codex 표시 이름과 기본 프롬프트 |

## 선택 도구와 미디어 검사

문서 사용 자체에는 별도 패키지가 필요하지 않습니다. 이미지·영상 생성 도구, Hyperframes, 음성 도구와 호스팅은 프로젝트와 사용 가능한 환경에 따라 선택합니다. 외부 서비스의 이용 조건과 비용은 별도입니다.

미디어 검사 스크립트에는 **Node.js와 ffprobe**가 필요합니다. 자동 설치나 네트워크 요청은 하지 않습니다.

```sh
node scripts/audit-media.mjs --help
node scripts/audit-media.mjs /path/to/media-manifest.json --out /path/to/media-audit.json
```

매니페스트의 경로는 매니페스트 파일이 있는 폴더를 기준으로 작성합니다.

```json
{
  "assets": [
    {
      "id": "hero",
      "kind": "video",
      "file": "media/hero.mp4",
      "poster": "media/hero.webp",
      "expectedAudio": false,
      "maxBytes": 12000000
    }
  ]
}
```

검사는 파일·크기·영상 스트림·오디오 존재 등을 확인합니다. 시각적 품질, 실제 음성 내용, 이용 권리, 모바일 재생은 별도로 검증해야 합니다.

## 기여와 라이선스

개선 제안은 Issue 또는 Pull Request로 보내주세요. 재현 상황, 수정 이유와 확인 결과를 함께 작성하면 도움이 됩니다. 고객 자료·인증키·공개 권한이 없는 미디어는 포함하지 마세요.

이 저장소의 문서와 스크립트는 [MIT License](LICENSE)로 배포합니다. 외부 사이트의 브랜드 및 콘텐츠, 연결된 도구와 서비스는 각각의 권리와 이용 조건을 따릅니다.
