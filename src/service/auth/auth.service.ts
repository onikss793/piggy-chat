import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AxiosError } from 'axios';
import * as jwt from 'jsonwebtoken';
import { UserDAO } from '../../dao';
import { IAppleHandler, IKakaoHandler } from '../../external';
import { IUser, OauthKind } from '../../model';
import { SYMBOL } from '../../symbols';
import { IAppleLoginDTO, IKakaoLoginDTO, ILoginDTO } from './interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SYMBOL.IAppleHandler) private readonly appleHandler: IAppleHandler,
    @Inject(SYMBOL.IKakaoHandler) private readonly kakaoHandler: IKakaoHandler,
  ) {}

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

  async login(userId: string): Promise<ILoginDTO> {
    const user = await UserDAO.findUser({ id: userId });
    const jwt = this.issueJWT(user);
    return this.createLoginDTO(user, jwt);
  }

  private createLoginDTO = (user: IUser, jwt: string): ILoginDTO => ({ id: user.id, jwt });

  private issueJWT = (user: IUser): string => jwt.sign(user.id, process.env.JWT_SECRET ?? 'secret');

  private createUserInfo = (account: string, nickname: string, oauthKind: OauthKind): IUser => ({
    verified: false,
    account,
    oauthKind,
    phoneNumber: null,
    nickname,
  });
}
