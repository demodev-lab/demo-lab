# MCP Hub Git 워크플로우 컨벤션

이 문서는 MCP Hub 프로젝트의 Git 브랜치 에 대한 컨벤션을 정의합니다.

## 1. 브랜치 전략

- `main` 브랜치는 항상 배포 가능한 안정적인 상태를 유지합니다.
- 하나의 기능 단위나 수정 사항이 완료될 때까지는 같은 브랜치에서 작업을 이어갑니다.
- 현재 작업과 **성격이 다른 새로운 작업을 시작할 때** (예: 기능 개발 중 긴급한 버그 수정이 필요할 때), 아래 네이밍 규칙에 따라 새 브랜치를 생성하여 컨텍스트를 분리합니다.

## 2. 브랜치 네이밍 컨벤션

모든 브랜치 이름은 다음 형식을 따릅니다.

**`<type>/<short-description>`**

- `<type>`: 브랜치의 목적을 나타냅니다. (feat, fix, refactor, docs, test, chore, ci)
- `<short-description>`: 작업을 간결하게 설명합니다. (영문, kebab-case 사용)

### 예시

- `feat/add-server-creation-api`
- `fix/db-connection-timeout-issue`
