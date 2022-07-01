import type { JwtPayload } from 'jsonwebtoken';
import type { ObjectId } from 'mongoose';
import type { IUser } from '../../model';

export type LoginResponse = {
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

export type CreateOrGetUserOption = {
  user: IUser;
  created: boolean;
}

export type CreateLoginResponseDTO = {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  isSignedUpUser: boolean;
}
