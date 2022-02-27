import { JwtPayload } from 'jsonwebtoken';
import { IAppleLoginDTO, IKakaoLoginDTO, ILoginDTO } from '../../dto';

export interface IAuthService {
	kakaoLogin(kakaoLoginDTO: IKakaoLoginDTO): Promise<ILoginDTO>;
  appleLogin(appleLoginDTO: IAppleLoginDTO): Promise<ILoginDTO>;
}

export type IdentityTokenPayload = JwtPayload & {
  nonce: string;
  c_hash: string;
  email: string;
  email_verified: boolean;
  is_private_email: string;
  auth_time: number;
}
