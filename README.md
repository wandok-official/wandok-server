# wandok-server

## API 공통 응답 포맷

본 서버는 모든 API 응답을 아래 규칙으로 통일합니다.

### 성공 응답 (Global Success Interceptor)
- 형태: `{ "ok": true, "data": ... }`

예시:
```json
{
  "ok": true,
  "data": { "status": "ok" }
}
```

### 실패 응답 (Global Exception Filter)

- 형태: `{ "ok": false, "error": { "code": "...", "message": "...", "details": ... } }`

예시:

```json
{
  "ok": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": ["email must be an email"]
  }
}
```

### Healthcheck

서버가 정상 동작 중인지 확인하기 위한 엔드포인트입니다.

- Method: GET
- URL: /health
- Status: 200 OK

응답 예시:
```json
{
  "ok": true,
  "data": { "status": "ok" }
}
```
