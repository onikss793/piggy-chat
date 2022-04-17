# Piggy-Chat

## Best Chat API

_처음에는 어드민에서 임의로 정한다_  

특정 group_channel 안에서 하루 동안 가장 많은 좋아요를 받은 메시지

- 메시지에 좋아요를 누를 때마다 서버에 `message_id : like_count` 갱신
- "좋아요" 수가 최다인 메시지 반환

## 회원가입 및 로그인

### 회원 최초 가입 flow
1. [CLIENT] oauth 로그인
2. [CLIENT] oauth 토큰으로 서버 로그인 API 호출 -> 서버 로그인 토큰 (SB 토큰 X)
3. [SERVER] oauth 토큰을 이용해 사용자 정보 받아옴
4. [SERVER] `user_id(ObjectId)`, `access_token`, `refresh_token`, `is_signed_up (nickname 이 설정되어 있는지)` 을 반환 
5. [CLIENT] 새로 회원 가입하는 사용자라면 `nickname` 입력 화면 진입
6. [CLIENT] 사용자가 입력한 `nickname` 이 unique 한지 서버에 API 호출
7. [SERVER] 해당 `nickname`이 unique 한지 여부 반환
8. [CLIENT] 약관동의 및 POST 사용자 `nickname` 호출
9. [CLIENT] `user_id(ObjectId)` 를 사용해서 SB 가입 API
10. [CLIENT] GET SB 유저 정보 API

### `access_token` 만료되었을 경우
1. [CLIENT] `access_token` 이 만료되었다면 서버로부터 `access_token`, `refresh_token` 을 재발급 받도록 한다. 
2. [CLIENT] GET SB 유저 정보 API

### `access_token`, `refresh_token` 모두 만료되었을 경우
1. oauth 로그인
2. oauth 토큰으로 서버 로그인 API -> 서버 로그인 토큰 + SB 로그인 토큰
3. GET SB 유저 정보 API
