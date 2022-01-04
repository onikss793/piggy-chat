import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { KakaoUserInfo } from './interface';

@Injectable()
export class KakaoHandler {
  async getUserInfoByAccessToken(accessToken: string) {
    const response = await axios.get<KakaoUserInfo>('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}`},
      params: {
        property_keys: ['properties.nickname', 'kakao_account.name', 'kakao_account.email']
      }
    });

    return response.data.kakao_account;
  }
}
