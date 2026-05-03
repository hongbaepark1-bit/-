# 농어촌·공유수면·간척지 법령분석시스템
## 로컬 서버 실행 가이드

API 키는 서버(.env 파일)에만 보관되며 브라우저에 절대 노출되지 않습니다.

---

## 빠른 시작 (3단계)

### 1단계 — Node.js 설치
https://nodejs.org 에서 LTS 버전 다운로드 및 설치

### 2단계 — API 키 설정
이 폴더에 `.env` 파일을 만들고 아래 내용 입력:
```
ANTHROPIC_API_KEY=sk-ant-여기에_실제_API_키를_입력
```
> `.env.example` 파일을 복사해서 `.env`로 이름 변경 후 키 입력

### 3단계 — 서버 실행
명령 프롬프트(CMD) 또는 PowerShell에서:
```
cd 이_폴더_경로
npm install
npm start
```

브라우저에서 **http://localhost:3000** 접속하면 바로 사용 가능!

---

## 파일 구조
```
legal-server/
├── server.js          ← 서버 (API 키 보관)
├── package.json
├── .env               ← API 키 입력 (직접 생성)
├── .env.example       ← 참고용 예시
└── public/
    └── index.html     ← 웹 화면
```

## API 키 발급
https://console.anthropic.com → API Keys → Create Key

## 포트 변경
.env 파일에 `PORT=8080` 추가하면 http://localhost:8080 으로 변경됩니다.

## 보안 안내
- `.env` 파일은 절대 외부에 공유하지 마세요.
- 이 서버는 127.0.0.1(본인 컴퓨터)에서만 접근 가능합니다.
