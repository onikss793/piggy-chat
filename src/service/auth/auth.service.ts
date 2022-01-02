import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { doesUserExist, saveUser } from '../../dao';
import { ILoginDTO } from '../../dto';
import { IUser } from '../../entity';
import { AppleHandler } from '../../external';
import { IAppleLoginDTO, IAuthService, IdentityTokenPayload } from './interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly appleHandler: AppleHandler) {}

  kakaoLogin(): void {
    throw new Error('Method not implemented.');
  }

  async appleLogin(body: IAppleLoginDTO): Promise<ILoginDTO>  {
    const { token } = body;
    const payload = jwt.decode(token, { complete: true });
    if (!payload?.header) throw new BadRequestException('Not a valid identity_token');

    const appleJWKS = await this.appleHandler.getJWKS();
    const { kid } = appleJWKS.find(appleJwks => appleJwks.alg === payload.header.alg && appleJwks.kid === payload.header.kid);
    if (!kid) throw new BadRequestException('Not a valid identity_token');

    const signingKey = await this.appleHandler.getSigningKey(kid);
    const identityTokenPayload = jwt.verify(
      token,
      signingKey.getPublicKey()
    ) as IdentityTokenPayload;
    const account = identityTokenPayload.sub;

    const user: IUser = {
      appleAccount: account,
      password: null,
      phoneNumber: null,
      nickName: account,
    };

    const userExists = await doesUserExist(user);
    const jsonwebtoken = userExists ? this.issueJWT(user) : this.issueJWT(await saveUser(user));

    return this.createLoginDTO(user, jsonwebtoken);
  }

  private createLoginDTO(user: IUser, jwt: string): ILoginDTO {
    return {
      id: user.id,
      jwt
    }
  }

  private issueJWT(user: IUser): string {
    return jwt.sign(String(user.id), 'secret');
  }
}
