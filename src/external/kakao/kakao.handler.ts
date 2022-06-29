import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IKakaoHandler, KakaoUserInfo } from './interface';

@Injectable()
export class KakaoHandler implements IKakaoHandler {
  async getUserInfoByAccessToken(accessToken: string): Promise<KakaoUserInfo> {
    const response = await axios.get<KakaoUserInfo>('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/x-www-form-urlencoded',
      },
      params: {
        property_keys: ['properties.nickname', 'kakao_account.name', 'kakao_account.email'],
      },
    });
    console.log(response, 'getUserInfoByAccessToken');
    return response.data;
  }
}

export class MockKakaoHandler implements IKakaoHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserInfoByAccessToken(accessToken: string): Promise<KakaoUserInfo> {
    return Promise.resolve({
      kakao_account: {
        email: 'test@kakao.com',
        profile: {
          nickName: 'testing_nickname',
        },
      },
    });
  }
}