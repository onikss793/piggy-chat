import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AxiosError } from 'axios';
import * as jwt from 'jsonwebtoken';
import { UserDAO } from '../../dao';
import { IUser, OauthKind } from '../../entity';
import { IAppleHandler, IKakaoHandler } from '../../external';
import { SYMBOL } from '../../symbols';
import { IAppleLoginDTO, IKakaoLoginDTO, ILoginDTO } from './interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SYMBOL.IAppleHandler) private readonly appleHandler: IAppleHandler,
    @Inject(SYMBOL.IKakaoHandler) private readonly kakaoHandler: IKakaoHandler,
  ) {
  }

  async kakaoLogin(kakaoLoginDTO: IKakaoLoginDTO): Promise<ILoginDTO> {
    const kakaoUserInfo = await this.kakaoHandler.getUserInfoByAccessToken(kakaoLoginDTO.access_token)
      .catch((err: AxiosError) => {
        throw new UnauthorizedException(JSON.stringify(err.response.data));
      });
    const userInfo = this.createUserInfo(kakaoUserInfo.kakao_account.email, kakaoUserInfo.kakao_account.profile?.nickName, OauthKind.KAKAO);
    const userExists = await UserDAO.doesUserExist(userInfo);
    const user = userExists
      ? await UserDAO.findUser({ account: userInfo.account })
      : await UserDAO.saveUser(userInfo);
    const jsonwebtoken = this.issueJWT(user);

    return this.createLoginDTO(user, jsonwebtoken);
  }

  async appleLogin(appleLoginDTO: IAppleLoginDTO): Promise<ILoginDTO> {
    const payload = this.appleHandler.getJWTPayload(appleLoginDTO.identity_token);
    const appleJWKS = await this.appleHandler.getJWKS();
    const kid = this.appleHandler.getKIDFromJWKS(appleJWKS, payload);
    const signingKey = await this.appleHandler.getSigningKey(kid);
    const identityTokenPayload = this.appleHandler.getIdentityTokenPayload(appleLoginDTO.identity_token, signingKey);
    const account = identityTokenPayload.sub;

    const userInfo = this.createUserInfo(account, account, OauthKind.APPLE);
    const userExists = await UserDAO.doesUserExist(userInfo);
    const user = userExists
      ? await UserDAO.findUser({ account: userInfo.account })
      : await UserDAO.saveUser(userInfo);
    const jsonwebtoken = this.issueJWT(user);

    return this.createLoginDTO(user, jsonwebtoken);
  }

  private createLoginDTO = (user: IUser, jwt: string): ILoginDTO => ({ id: user.id, jwt });

  private issueJWT = (user: IUser): string => jwt.sign(String(user.id), 'secret');

  private createUserInfo = (account: string, nickname: string, oauthKind: OauthKind): IUser => ({
    verified: false,
    account,
    oauthKind,
    phoneNumber: null,
    nickname,
  });
}
