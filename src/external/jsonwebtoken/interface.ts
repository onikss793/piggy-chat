import { IUser } from '../../model';

export interface IJWTHandler {
  issueJWT(payload: Record<string, unknown>, expiry: number | string): string;

  issueAccessToken(user: IUser): string;

  issueRefreshToken(id: string): string;

  verifyAccessToken(accessToken: string): AccessTokenPayload;

  verifyRefreshToken(refreshToken: string): RefreshTokenPayload;

  decodeToken<T>(token): T;

  isTokenExpiredError(error: Error): boolean;
}

export type AccessTokenPayload = {
  userId: string;
}

export type RefreshTokenPayload = {
  sessionId: string;
}
