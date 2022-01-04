import { JwtPayload } from 'jsonwebtoken';
import { ILoginDTO } from '../../dto';

export interface IAuthService {
	kakaoLogin(kakaoLoginDTO: IKakaoLoginDTO): Promise<ILoginDTO>;
  appleLogin(appleLoginDTO: IAppleLoginDTO): Promise<ILoginDTO>;
}

export interface IAppleLoginDTO {
	token: string;
}

export interface IKakaoLoginDTO {
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
