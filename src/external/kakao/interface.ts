/**
 * 회원 및 본인 인증을... mvp에 포함하는게 맞을지? -> 본인 인증은 나아아중에
 * sns 로그인 줄일 수 있는지? -> 카카오 애플만 가자

 채팅 관련 로그는 DynamoDB 에 저장하는 것으로. IDEALLY [send_bird_chat_id]: chatting_log
 사용자 관련 데이터는 몽고 디비에 저장 serverless 버전 사용
 */

export interface KakaoUserInfo {
  kakao_account: {
    email: string;
    profile: {
      nickName: string;
    }
  }
}
