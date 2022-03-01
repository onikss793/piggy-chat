import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { IdentityTokenPayload } from '../../service';

export type AppleJWKS = {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

export interface IAppleHandler {
  getJWKS(): Promise<AppleJWKS[]>;

  getSigningKey(kid: string): Promise<jwksClient.SigningKey>;

  getJWTPayload(identityToken: string): jwt.Jwt;

  getKIDFromJWKS(jwks: AppleJWKS[], payload: jwt.Jwt): string;

  getIdentityTokenPayload(identityToken: string, signingKey: jwksClient.SigningKey): IdentityTokenPayload;
}
