# Piggy-Chat

## TODO

### Best Chat API

특정 group_channel 안에서 하루 동안 가장 많은 좋아요를 받은 메시지

- [SENDBIRD] 기간 단위로 group_channel 내의 채팅을 모두 GET
- "좋아요" 수가 최다인 메시지 반환

### Send File

group_channel 에서 파일 메시지 전송 시 사용

- 파일 저장할 S3 버켓 확보
- 파일 전송 시
    1. 서버에 Send File API 호출
    2. 이미지 압축 및 최적화 (OPTIONAL)
    3. S3 에 업로드
    4. 저장된 파일의 public_url 반환하기
