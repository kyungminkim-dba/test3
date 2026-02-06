## 언어 및 커뮤니케이션 규칙
 - 기본 응답 언어: 한국어
 - 코드 주석: 한국어로 작성
 - 커밋 메시지: 한국어로 작성
 - 문서화: 한국어로 작성
 - 변수명/함수명: 영어 (코드 표준 준수)

 ## 프로젝트 기술 스택 요약
| 영역 | 기술 스택 | 역할 및 특징 |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router) | 최신 리액트 기능을 활용한 웹 애플리케이션 프레임워크 |
| **Language** | TypeScript | 전 영역 타입 안전성 확보 및 개발 생산성 향상 |
| **Styling** | Tailwind CSS v4(no tailwind.config file) + shadcn/ui | 유틸리티 기반 스타일링 및 고품질 UI 컴포넌트 시스템 |
| **Backend (API)** | **FastAPI (Python)** | 고성능 비동기 API 및 **JWT 기반 자체 인증** 시스템 |
| **Database** | **MySQL (Self-hosted)** | 직접 구축 및 운영을 통한 데이터 주권 확보 |
| **Security** | **HashiCorp Vault** | **JWT Secret Key, DB 패스워드** 등 민감 정보 암호화 관리 |
| **ORM / Migration** | SQLModel + Alembic | Python 타입 기반 DB 조작 및 테이블 변경 이력 관리 |
| **State Management** | Zustand | 가볍고 직관적인 클라이언트 전역 상태 관리 |
| **Form Management** | React Hook Form + Zod | 폼 데이터 관리 및 프론트엔드 유효성 검증 |
| **Data Fetching** | TanStack Query (v5) | 서버 데이터 캐싱 및 API 통신 최적화 |
| **Validation** | Pydantic | 백엔드 데이터 모델링 및 입출력 유효성 검사 |

## 위험한 명령어 실행 규칙 (Sandbox)

### 금지된 명령어 (호스트에서 직접 실행 금지)
- `rm -rf /`, `rm -rf ~/*`, `rm -rf ./*` 등 대량 삭제 명령
- `sudo` 권한이 필요한 시스템 변경 명령
- 신뢰할 수 없는 외부 스크립트 실행
- `chmod 777`, `chown` 등 권한 변경 명령

### 샌드박스 사용 원칙
1. **위험한 코드 테스트** → Docker 컨테이너에서 실행
2. **신뢰할 수 없는 코드** → 격리된 환경에서 먼저 검증
3. **시스템 명령어 테스트** → 컨테이너 또는 가상환경 사용

### 샌드박스 실행 방법
```bash
# 일회용 컨테이너 생성
docker run -it --rm --name sandbox ubuntu:22.04 bash

# 위험한 작업 후 컨테이너 삭제
docker rm -f sandbox
```