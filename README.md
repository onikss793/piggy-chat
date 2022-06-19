# Piggy-Chat

## TODO

1. Alert API 구성  
   [ ] 웹훅을 받아 알람 생성 및 삭제 부분 만든다  
2. 베스트멘트 API 재구성 -> 어드민에서 추출한 것 개발한 이후로 재구성  
   [x] 리액션 추가하는 부분은 웹훅을 사용한다.  
   [ ] 리액션 추가 삭제 테스트 코드 작성  
   [ ] 어드민에서 수동으로 설정할 수 있도록  
3. 인프라 구성
   [ ] DB 구성  
   [ ] lambda 구성  
   [ ] API Gateway 및 도메인 설정  
4. 어드민 개발
   [ ] 핫키워드 수동 설정  
   [ ] 베스트멘트 수동 설정  

## CustomData

- message_sent -> parent_message_id

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

### 알림

신규 노티피케이션은 상단에서 아래로 누적됨

시간 표기 : 방금, N분 전, N시간 전, N일 전, N주 전, N달 전

- 유저 활동 - 좋아요, 답글이 달린 경우 알림이 발송됨
    - ***님이 답글을 남겼습니다 : 원문
      (시간표기)
    - ***님이 좋아요를 남겼습니다 : 원문
- 유저가 참여한 쓰레드에 다른 유저가 답글을 단경우 알림이 발송됨
    - ***님이 답글을 남겼습니다 : 원문
      (시간표기)
- 본인 닉네임이 멘션되어 채팅이 달린 경우 알림이 발송됨
    - 유저네임 : @멘션네임, 채팅 원문
      (시간표기)
- 신고를 받은 경우 알림 발송됨
    - 해당 글이 신고를 받았습니다. :원문
      (시간표기)
- 신고 5회 누적되어 채팅이 삭제된 경우 알림 발송됨
    - 해당 글이 5회 신고되어 삭제되었습니다. : 원문
      (시간표기
- 어드민 계정이 공지를 등록한 경우 알림이 발송됨
    - 주식방(또는 코인방)에 공지가 등록되었습니다.
      (시간표기)
- 홈 베스트 멘트, 키워드 업데이트 시 알림이 발송됨
    - 베스트 멘트가 업데이트 되었습니다.
      (시간표기)
- 채팅방 오늘의 베스트 업데이트 시 알림 발송됨
    - 채팅방의 오늘의 베스트가 업데이트 되었습니다.
      (시간표기)
