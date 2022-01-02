import { JwtPayload } from 'jsonwebtoken';
import { ILoginDTO } from '../../dto';

export interface IAuthService {
	kakaoLogin(): void;
  appleLogin(data: IAppleLoginDTO): Promise<ILoginDTO>;
}

export interface IAppleLoginDTO {
	token: string;
}

export type IdentityTokenPayload = JwtPayload & {
  nonce: string;
  c_hash: string;
  email: string;
  email_verified: boolean;
  is_private_email: string;
  auth_time: number;
}

export interface IAuthService {
	kakaoLogin(): void;
  appleLogin(data: IAppleLoginDTO): Promise<ILoginDTO>;
}

export interface IAppleLoginDTO {
	token: string;
}
