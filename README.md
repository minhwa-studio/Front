# **민화사진관 Front (React Native)**
- 개요: 사용자의 사진을 민화풍으로 변환하고, 개인/공용 전시관에서 전시할 수 있는 웹 서비스
- 핵심 흐름: 홈 → 로그인/회원가입 → 민화 변환소 or 민화 전시관
- 기술: React Native, React Navigation, Zustand, Axios
- 백엔드 연동: 변환 요청/전시 데이터 저장·조회(MongoDB)

# 민화사진관 홈
<img width="720" height="328" alt="민화사진관 홈" src="https://github.com/user-attachments/assets/2dc0fab7-e8a7-4134-9d2d-23353c566f2e" />
# 민화 변환소
<img width="720" height="328" alt="민화변환소" src="https://github.com/user-attachments/assets/3c1cc6b3-9464-4501-a856-166fe9d2f46e" />
# 민화 전시관
<img width="720" height="328" alt="전시관" src="https://github.com/user-attachments/assets/2f42b5e1-4b38-4bc8-9eca-bc3cfbe1aa36" />



### 1) 개요

- React Native 기반의 민화사진관 모바일 앱

- 사용자 흐름 (앱 내 네비게이션):

  - 홈(소개/배너) → 회원가입/로그인 →
  - 민화 변환소 (사진 업로드·변환 결과 조회) 또는
  - 민화 전시관 (나만의 전시/디지털 전시 둘 다 접근)

사용자 흐름 다이어그램
```
  A[홈] --> B[회원가입/로그인]
  B --> C[민화 변환소]
  B --> D[민화 전시관]
  C --> C1[사진 업로드]
  C1 --> C2[백엔드 요청 → AI 변환]
  C2 --> C3[결과 보기/저장/공유]
  D --> D1[나만의 전시관]
  D --> D2[디지털 전시관]
```
### 2) 주요 기능
**2-1. 민화 변환소**

- 사용자의 사진 업로드 → 백엔드 서버 Request
→ AI 모델 변환 처리(백엔드에서 연동) → 백엔드 Response
→ 변환된 결과 이미지 출력 (저장/공유/전시 등록 버튼 제공)

- 업로드 진행 표시(Progress), 실패 시 재시도, 네트워크 예외 처리

**2-2. 민화 전시관**

- 나만의 민화 전시관

  - 내 앨범(내 변환 결과)에서 작품 선택
  
  - 전시 순서/제목/설명 구성
  
  - “전시 완료” 시 백엔드 요청 → MongoDB 저장

- 민화 디지털 전시관

  - 전시관 게시판(목록/검색/정렬)
  
  - 백엔드 요청 → MongoDB 쿼리 조회 → 백엔드 Response
  
  - 전시 상세(썸네일, 캡션, 제작자, 좋아요/북마크 등)

> 선택 기능(옵션): 좋아요/스크랩, 공유 링크, 전시관 커버 이미지/테마



### 3) 기술 스택 & 아키텍처

Framework: React Native
Navigation: @react-navigation/native (Stack)
데이터: zustand
HTTP: axios (인터셉터로 토큰/에러 공통 처리)
이미지: react-native-image-picker (갤러리/카메라), 캐싱/리사이즈 전략
유틸: 환경변수(react-native-config)

### 4. 빠른 시작 (Windows PowerShell)
```
# Front
0. 깃 클론
git clone <repo-url> minhwa-front
cd minhwa-front

1. 의존성 설치
npm install
npm install -g yarn
yarn install
(node 설치는 nodejs20.15.1 설치 해야됩니다.)

2. 추가 의존성
yarn add zustand
yarn add @react-native-async-storage/async-storage

3. 실행
yarn web

API_URL=
```

### 5) 화면 & 사용자 흐름

- 홈: 서비스 소개/CTA 버튼(시작하기, 전시 보러가기)

- 회원가입/로그인: 이메일/소셜, 토큰 저장, 자동 로그인

- 민화 변환소:

  1. 사진 선택(갤러리/카메라)
  
  2. 업로드 → 진행률 표시
  
  3. 결과 수신 → 보기/저장/전시 등록

- 나만의 전시관:

  1. 내 작품 선택(복수 선택)
  
  2. 전시 순서·설명 입력
  
  3. 전시 등록(백엔드→MongoDB)

- 디지털 전시관:

  1. 전시 목록(검색/정렬/필터)
  
  2. 전시 상세(슬라이드, 캡션, 제작자)

