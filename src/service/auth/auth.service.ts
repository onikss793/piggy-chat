import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { IKakaoLoginDTO } from '.';
import { doesUserExist, saveUser } from '../../dao';
import { ILoginDTO } from '../../dto';
import { IUser } from '../../entity';
import { AppleHandler, KakaoHandler } from '../../external';
import { IAppleLoginDTO, IAuthService, IdentityTokenPayload } from './interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly appleHandler: AppleHandler,
    private readonly kakaoHandler: KakaoHandler,
  ) {}

  async kakaoLogin(kakaoLoginDTO: IKakaoLoginDTO): Promise<ILoginDTO> {
    const { token } = kakaoLoginDTO;
    if (!token) throw new BadRequestException('No access_token provided');

    const kakaoUserInfo = await this.kakaoHandler.getUserInfoByAccessToken(token);

    const user: IUser = {
      kakaoAccount: kakaoUserInfo.email,
      password: null,
      phoneNumber: null,
      nickname: kakaoUserInfo.profile?.nickName,
    }

    const userExists = await doesUserExist(user);
    const jsonwebtoken = userExists ? this.issueJWT(user) : this.issueJWT(await saveUser(user));

    return this.createLoginDTO(user, jsonwebtoken);
  }

  async appleLogin(appleLoginDTO: IAppleLoginDTO): Promise<ILoginDTO> {
    const { token } = appleLoginDTO;
    const payload = jwt.decode(token, { complete: true });
    if (!payload?.header) throw new BadRequestException('Not a valid identity_token');

    const appleJWKS = await this.appleHandler.getJWKS();
    const { kid } = appleJWKS.find(appleJwks => appleJwks.alg === payload.header.alg && appleJwks.kid === payload.header.kid);
    if (!kid) throw new BadRequestException('Not a valid identity_token');

    const signingKey = await this.appleHandler.getSigningKey(kid);
    const identityTokenPayload = jwt.verify(token, signingKey.getPublicKey()) as IdentityTokenPayload;
    const account = identityTokenPayload.sub;

    const user: IUser = {
      appleAccount: account,
      password: null,
      phoneNumber: null,
      nickname: account,
    };

    const userExists = await doesUserExist(user);
    const jsonwebtoken = userExists ? this.issueJWT(user) : this.issueJWT(await saveUser(user));

    return this.createLoginDTO(user, jsonwebtoken);
  }

  private createLoginDTO(user: IUser, jwt: string): ILoginDTO {
    return {
      id: user.id,
      jwt
    }
  }

  private issueJWT(user: IUser): string {
    return jwt.sign(String(user.id), 'secret');
  }
}
