import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { randomBytes } from 'crypto';
import { SessionDAO, UserDAO } from '../../dao';
import { IAppleHandler, IKakaoHandler } from '../../external';
import { AccessTokenPayload, IJWTHandler } from '../../external/jsonwebtoken';
import { IUser, OauthKind } from '../../model';
import { Symbols } from '../../symbols';
import { IAppleLoginDTO, IKakaoLoginDTO, ILoginDTO } from './interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Symbols.IAppleHandler) private readonly appleHandler: IAppleHandler,
    @Inject(Symbols.IKakaoHandler) private readonly kakaoHandler: IKakaoHandler,
    @Inject(Symbols.IJWTHandler) private readonly JWTHandler: IJWTHandler,
  ) {}

  async kakaoLogin(kakaoLoginDTO: IKakaoLoginDTO): Promise<ILoginDTO> {
    const kakaoUserInfo = await this.kakaoHandler.getUserInfoByAccessToken(kakaoLoginDTO.access_token)
      .catch((err: AxiosError) => {
        throw new UnauthorizedException(JSON.stringify(err.response.data));
      });
    const userInfo = this.createUserInfo(kakaoUserInfo.kakao_account.email, kakaoUserInfo.kakao_account.email, OauthKind.KAKAO);
    const { user, created } = await this.createOrGetUser(userInfo);
    const accessToken = this.JWTHandler.issueAccessToken(user);
    const sessionId = this.issueSessionId();
    const refreshToken = this.JWTHandler.issueRefreshToken(sessionId);

    await SessionDAO.upsertSessionId(user.id, sessionId);

    return this.createLoginDTO({ user, accessToken, refreshToken, isSignedUpUser: !created });
  }

  async appleLogin(appleLoginDTO: IAppleLoginDTO): Promise<ILoginDTO> {
    const payload = this.appleHandler.getJWTPayload(appleLoginDTO.identity_token);
    const appleJWKS = await this.appleHandler.getJWKS();
    const kid = this.appleHandler.getKIDFromJWKS(appleJWKS, payload);
    const signingKey = await this.appleHandler.getSigningKey(kid);
    const identityTokenPayload = this.appleHandler.getIdentityTokenPayload(appleLoginDTO.identity_token, signingKey);
    const account = identityTokenPayload.sub;

    const userInfo = this.createUserInfo(account, account, OauthKind.APPLE);
    const { user, created } = await this.createOrGetUser(userInfo);
    const accessToken = this.JWTHandler.issueAccessToken(user);
    const sessionId = this.issueSessionId();
    const refreshToken = this.JWTHandler.issueRefreshToken(sessionId);

    await SessionDAO.upsertSessionId(user.id, sessionId);

    return this.createLoginDTO({ user, accessToken, refreshToken, isSignedUpUser: !created });
  }

  async login(accessToken: string, refreshToken: string): Promise<ILoginDTO> {
    try {
      const accessTokenPayload = this.JWTHandler.verifyAccessToken(accessToken);

      const user = await UserDAO.findUser({ id: accessTokenPayload.userId });
      return this.createLoginDTO({
        user,
        accessToken: this.JWTHandler.issueAccessToken(user),
        refreshToken: this.JWTHandler.issueRefreshToken(this.issueSessionId()),
        isSignedUpUser: true
      });
    } catch (e) {
      try {
        if (this.JWTHandler.isTokenExpired(e)) {
          return this.verifyRefreshToken(accessToken, refreshToken);
        }

        throw new UnauthorizedException(e);
      } catch (e) {
        throw new UnauthorizedException(e);
      }
    }
  }

  private verifyRefreshToken = async (accessToken: string, refreshToken: string) => {
    try {
      const refreshTokenPayload = this.JWTHandler.verifyRefreshToken(refreshToken);
      const session = await SessionDAO.findSessionBySessionId(refreshTokenPayload.sessionId);
      const decoded = this.JWTHandler.decodeToken<AccessTokenPayload>(accessToken);

      if (String(session?.userId) !== decoded?.userId) {
        throw new UnauthorizedException('Session Error');
      }

      const user = await UserDAO.findUser({ id: session?.userId });
      return this.createLoginDTO({
        user,
        accessToken: this.JWTHandler.issueAccessToken(user),
        refreshToken: this.JWTHandler.issueRefreshToken(this.issueSessionId()),
        isSignedUpUser: true
      });
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  };

  private createOrGetUser = async (userInfo: IUser): Promise<{ user: IUser, created: boolean }> => {
    const userExists = await UserDAO.doesUserExist(userInfo);
    const user = userExists
      ? await UserDAO.findUser({ account: userInfo.account })
      : await UserDAO.saveUser(userInfo);
    return { user, created: !userExists };
  };

  private createLoginDTO = ({
    user, accessToken, refreshToken, isSignedUpUser
  }: { user: IUser, accessToken: string, refreshToken: string, isSignedUpUser: boolean }): ILoginDTO => (
    { id: user.id, accessToken, refreshToken, isSignedUpUser }
  );

  private createUserInfo = (account: string, nickname: string, oauthKind: OauthKind): IUser => ({
    verified: false,
    account,
    oauthKind,
    phoneNumber: null,
    nickname,
  });

  private issueSessionId = (): string => {
    return randomBytes(5).toString('base64');
  };
}
