import { JwtPayload } from 'jsonwebtoken';

export interface ILoginDTO {
  id: string;
  jwt: string;
}

export interface IAppleLoginDTO {
  identity_token: string;
}

export interface IKakaoLoginDTO {
  access_token: string;
}

export type IdentityTokenPayload = JwtPayload & {
  nonce: string;
  c_hash: string;
  email: string;
  email_verified: boolean;
  is_private_email: string;
  auth_time: number;
}
