export interface KakaoUserInfo {
  kakao_account: {
    email: string;
    profile: {
      nickName: string;
    }
  };
}

export interface IKakaoHandler {
  getUserInfoByAccessToken(accessToken: string): Promise<KakaoUserInfo>;
}
