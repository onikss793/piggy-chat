import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import type { IUser } from '../../model';
import type { AccessTokenPayload, IJWTHandler, RefreshTokenPayload } from './interface';

@Injectable()
export class JWTHandler implements IJWTHandler {
  private readonly secret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.secret = process.env.JWT_SECRET ?? 'secret';
    this.accessTokenExpiry = '1d';
    this.refreshTokenExpiry = '14d';
  }

  public issueJWT(payload: Record<string, unknown>, expiry: number | string): string {
    return jwt.sign(payload, this.secret, { expiresIn: expiry });
  }

  public issueAccessToken(user: IUser): string {
    return this.issueJWT({ userId: user.id }, this.accessTokenExpiry);
  }

  public issueRefreshToken(randomByte: string): string {
    return this.issueJWT({ sessionId: randomByte }, this.refreshTokenExpiry);
  }

  public verifyAccessToken(accessToken: string): AccessTokenPayload {
    return jwt.verify(accessToken, this.secret) as AccessTokenPayload;
  }

  public verifyRefreshToken(refreshToken: string): RefreshTokenPayload {
    return jwt.verify(refreshToken, this.secret) as RefreshTokenPayload;
  }

  public isTokenExpiredError(error: Error): boolean {
    return error.name === 'TokenExpiredError';
  }

  public decodeToken<T>(token): T {
    return jwt.decode(token, { json: true }) as T;
  }
}
