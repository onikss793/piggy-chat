import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { AxiosError } from 'axios';
import { randomBytes } from 'crypto';
import { SessionDAO, UserDAO } from '../../dao';
import type { AccessTokenPayload, IAppleHandler, IJWTHandler, IKakaoHandler } from '../../external';
import type { IUser, OauthKind } from '../../model';
import { Symbols } from '../../symbols';
import type {
  CreateLoginResponseDTO,
  CreateOrGetUserOption,
  IAppleLoginDTO,
  IKakaoLoginDTO,
  LoginResponse,
} from './interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Symbols.IAppleHandler) private readonly appleHandler: IAppleHandler,
    @Inject(Symbols.IKakaoHandler) private readonly kakaoHandler: IKakaoHandler,
    @Inject(Symbols.IJWTHandler) private readonly JWTHandler: IJWTHandler,
  ) {}

  async kakaoLogin(kakaoLoginDTO: IKakaoLoginDTO): Promise<LoginResponse> {
    const kakaoUserInfo = await this.kakaoHandler.getUserInfoByAccessToken(kakaoLoginDTO.accessToken)
      .catch((err: AxiosError) => {
        throw new UnauthorizedException(err);
      });
    const userInfo = this.createUserInfo(kakaoUserInfo.kakao_account.email, 'KAKAO');
    const { user, created } = await this.createOrGetUser(userInfo);
    const accessToken = this.JWTHandler.issueAccessToken(user);
    const sessionId = this.issueSessionId();
    const refreshToken = this.JWTHandler.issueRefreshToken(sessionId);

    await SessionDAO.upsertSessionId(user.id, sessionId);

    return this.createLoginResponse({ user, accessToken, refreshToken, isSignedUpUser: !created });
  }

  async appleLogin(appleLoginDTO: IAppleLoginDTO): Promise<LoginResponse> {
    const payload = this.appleHandler.getJWTPayload(appleLoginDTO.identityToken);
    const appleJWKS = await this.appleHandler.getJWKS();
    const kid = this.appleHandler.getKIDFromJWKS(appleJWKS, payload);
    const signingKey = await this.appleHandler.getSigningKey(kid);
    const identityTokenPayload = this.appleHandler.getIdentityTokenPayload(appleLoginDTO.identityToken, signingKey);
    const account = identityTokenPayload.sub;

    const userInfo = this.createUserInfo(account, 'APPLE');
    const { user, created } = await this.createOrGetUser(userInfo);
    const accessToken = this.JWTHandler.issueAccessToken(user);
    const sessionId = this.issueSessionId();
    const refreshToken = this.JWTHandler.issueRefreshToken(sessionId);

    await SessionDAO.upsertSessionId(user.id, sessionId);

    return this.createLoginResponse({ user, accessToken, refreshToken, isSignedUpUser: !created });
  }

  async login(accessToken: string, refreshToken: string): Promise<LoginResponse> {
    try {
      const accessTokenPayload = this.JWTHandler.verifyAccessToken(accessToken);

      const user = await UserDAO.findUser({ id: accessTokenPayload.userId });
      return this.createLoginResponse({
        user,
        accessToken: this.JWTHandler.issueAccessToken(user),
        refreshToken: this.JWTHandler.issueRefreshToken(this.issueSessionId()),
        isSignedUpUser: true,
      });
    } catch (e) {
      try {
        if (this.JWTHandler.isTokenExpiredError(e)) {
          return this.verifyRefreshToken(accessToken, refreshToken);
        }

        throw new UnauthorizedException(e);
      } catch (e) {
        throw new UnauthorizedException(e);
      }
    }
  }

  async isNicknameUnique(nickname: string): Promise<boolean> {
    return UserDAO.isNicknameUnique(nickname);
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
      return this.createLoginResponse({
        user,
        accessToken: this.JWTHandler.issueAccessToken(user),
        refreshToken: this.JWTHandler.issueRefreshToken(this.issueSessionId()),
        isSignedUpUser: true,
      });
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  };

  private createOrGetUser = async (userInfo: Omit<IUser, 'nickname'>): Promise<CreateOrGetUserOption> => {
    const userExists = await UserDAO.doesAccountExists(userInfo.account);
    const user = userExists
      ? await UserDAO.findUser({ account: userInfo.account })
      : await UserDAO.initialSignUpUser(userInfo);
    return { user, created: !userExists };
  };

  private createLoginResponse = ({ user, accessToken, refreshToken, isSignedUpUser }: CreateLoginResponseDTO): LoginResponse => (
    { id: user.id, accessToken, refreshToken, isSignedUpUser }
  );

  private createUserInfo = (account: string, oauthKind: OauthKind): IUser => ({
    verified: false,
    account,
    oauthKind,
    nickname: account,
    phoneNumber: null,
  });

  private issueSessionId = (): string => {
    return randomBytes(4).toString('base64');
  };
}
