import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AxiosError } from 'axios';
import * as jwt from 'jsonwebtoken';
import { doesUserExist, saveUser } from '../../dao';
import { IAppleLoginDTO, IKakaoLoginDTO, ILoginDTO } from '../../dto';
import { IUser, OauthKind } from '../../entity';
import { AppleHandler, KakaoHandler } from '../../external';
import { IdentityTokenPayload } from './interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly appleHandler: AppleHandler,
    private readonly kakaoHandler: KakaoHandler,
  ) {
  }

  async kakaoLogin(kakaoLoginDTO: IKakaoLoginDTO): Promise<ILoginDTO> {
    const kakaoUserInfo = await this.kakaoHandler.getUserInfoByAccessToken(kakaoLoginDTO.access_token)
      .catch((err: AxiosError<{ msg: string }>) => {
        throw new UnauthorizedException(err.response.data.msg);
      });

    const user: IUser = {
      verified: false,
      account: kakaoUserInfo.kakao_account.email,
      oauthKind: OauthKind.KAKAO,
      phoneNumber: null,
      nickname: kakaoUserInfo.kakao_account.profile?.nickName
    };

    const userExists = await doesUserExist(user);
    const jsonwebtoken = userExists ? this.issueJWT(user) : this.issueJWT(await saveUser(user));

    return this.createLoginDTO(user, jsonwebtoken);
  }

  async appleLogin(appleLoginDTO: IAppleLoginDTO): Promise<ILoginDTO> {
    const payload = jwt.decode(appleLoginDTO.identity_token, { complete: true });
    if (!payload?.header) throw new UnauthorizedException('Not a valid identity_token');

    const appleJWKS = await this.appleHandler.getJWKS();
    const { kid } = appleJWKS.find(appleJwks => appleJwks.alg === payload.header.alg && appleJwks.kid === payload.header.kid);
    if (!kid) throw new UnauthorizedException('Not a valid identity_token');

    const signingKey = await this.appleHandler.getSigningKey(kid);
    const identityTokenPayload = jwt.verify(appleLoginDTO.identity_token, signingKey.getPublicKey()) as IdentityTokenPayload;
    const account = identityTokenPayload.sub;

    const user: IUser = {
      verified: false,
      account,
      oauthKind: OauthKind.APPLE,
      phoneNumber: null,
      nickname: account,
    };

    const userExists = await doesUserExist(user);
    const jsonwebtoken = userExists ? this.issueJWT(user) : this.issueJWT(await saveUser(user));

    return this.createLoginDTO(user, jsonwebtoken);
  }

  private createLoginDTO = (user: IUser, jwt: string): ILoginDTO => ({
    id: user.id,
    jwt
  });

  private issueJWT = (user: IUser): string => jwt.sign(String(user.id), 'secret');
}
