import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

export interface ILoginDTO {
  id: ObjectId;
  accessToken: string;
  refreshToken: string;
  isSignedUpUser: boolean;
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
