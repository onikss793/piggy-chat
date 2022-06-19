import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

export interface ILoginDTO {
  id: ObjectId;
  accessToken: string;
  refreshToken: string;
  isSignedUpUser: boolean;
}

export interface IAppleLoginDTO {
  identityToken: string;
}

export interface IKakaoLoginDTO {
  accessToken: string;
}

export type IdentityTokenPayload = JwtPayload & {
  nonce: string;
  c_hash: string;
  email: string;
  email_verified: boolean;
  is_private_email: string;
  auth_time: number;
}
