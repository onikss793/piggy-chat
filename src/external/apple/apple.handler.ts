import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import JwksRsa, * as jwksClient from 'jwks-rsa';
import { IdentityTokenPayload } from '../../service';
import { AppleJWKS, IAppleHandler } from './interface';

@Injectable()
export class AppleHandler implements IAppleHandler {
  private readonly jwksUri: string;
  private readonly jwksClient: JwksRsa.JwksClient;

  constructor() {
    this.jwksUri = 'https://appleid.apple.com/auth/keys';
    this.jwksClient = jwksClient({ jwksUri: this.jwksUri });
  }

  async getJWKS(): Promise<AppleJWKS[]> {
    const { data } = await axios.get<{ keys: AppleJWKS[] }>(this.jwksUri);
    return data.keys;
  }

  async getSigningKey(kid: string): Promise<jwksClient.SigningKey> {
    return this.jwksClient.getSigningKey(kid);
  }

  getJWTPayload(identityToken: string): jwt.Jwt {
    const payload = jwt.decode(identityToken, { complete: true });
    if (!payload?.header) throw new UnauthorizedException('Not a valid identity_token');
    return payload;
  }

  getKIDFromJWKS(jwks: AppleJWKS[], payload: jwt.Jwt): string {
    const { kid } = jwks.find(appleJwks => appleJwks.alg === payload.header.alg && appleJwks.kid === payload.header.kid);
    if (!kid) throw new UnauthorizedException('Not a valid identity_token');
    return kid;
  }

  getIdentityTokenPayload(identityToken: string, signingKey: jwksClient.SigningKey): IdentityTokenPayload {
    return jwt.verify(identityToken, signingKey.getPublicKey()) as IdentityTokenPayload;
  }
}

export class MockAppleHandler implements IAppleHandler {
  private readonly jwksUri: string;
  private readonly jwksClient: JwksRsa.JwksClient;

  constructor() {
    this.jwksUri = 'https://appleid.apple.com/auth/keys';
    this.jwksClient = jwksClient({ jwksUri: this.jwksUri });
  }

  async getJWKS(): Promise<AppleJWKS[]> {
    return [
      {
        kty: 'RSA',
        kid: 'W6WcOKB',
        use: 'sig',
        alg: 'RS256',
        n: '2Zc5d0-zkZ5AKmtYTvxHc3vRc41YfbklflxG9SWsg5qXUxvfgpktGAcxXLFAd9Uglzow9ezvmTGce5d3DhAYKwHAEPT9hbaMDj7DfmEwuNO8UahfnBkBXsCoUaL3QITF5_DAPsZroTqs7tkQQZ7qPkQXCSu2aosgOJmaoKQgwcOdjD0D49ne2B_dkxBcNCcJT9pTSWJ8NfGycjWAQsvC8CGstH8oKwhC5raDcc2IGXMOQC7Qr75d6J5Q24CePHj_JD7zjbwYy9KNH8wyr829eO_G4OEUW50FAN6HKtvjhJIguMl_1BLZ93z2KJyxExiNTZBUBQbbgCNBfzTv7JrxMw',
        e: 'AQAB'
      },
      {
        kty: 'RSA',
        kid: 'YuyXoY',
        use: 'sig',
        alg: 'RS256',
        n: '1JiU4l3YCeT4o0gVmxGTEK1IXR-Ghdg5Bzka12tzmtdCxU00ChH66aV-4HRBjF1t95IsaeHeDFRgmF0lJbTDTqa6_VZo2hc0zTiUAsGLacN6slePvDcR1IMucQGtPP5tGhIbU-HKabsKOFdD4VQ5PCXifjpN9R-1qOR571BxCAl4u1kUUIePAAJcBcqGRFSI_I1j_jbN3gflK_8ZNmgnPrXA0kZXzj1I7ZHgekGbZoxmDrzYm2zmja1MsE5A_JX7itBYnlR41LOtvLRCNtw7K3EFlbfB6hkPL-Swk5XNGbWZdTROmaTNzJhV-lWT0gGm6V1qWAK2qOZoIDa_3Ud0Gw',
        e: 'AQAB'
      },
      {
        kty: 'RSA',
        kid: '86D88Kf',
        use: 'sig',
        alg: 'RS256',
        n: 'iGaLqP6y-SJCCBq5Hv6pGDbG_SQ11MNjH7rWHcCFYz4hGwHC4lcSurTlV8u3avoVNM8jXevG1Iu1SY11qInqUvjJur--hghr1b56OPJu6H1iKulSxGjEIyDP6c5BdE1uwprYyr4IO9th8fOwCPygjLFrh44XEGbDIFeImwvBAGOhmMB2AD1n1KviyNsH0bEB7phQtiLk-ILjv1bORSRl8AK677-1T8isGfHKXGZ_ZGtStDe7Lu0Ihp8zoUt59kx2o9uWpROkzF56ypresiIl4WprClRCjz8x6cPZXU2qNWhu71TQvUFwvIvbkE1oYaJMb0jcOTmBRZA2QuYw-zHLwQ',
        e: 'AQAB'
      }
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getSigningKey(kid: string): Promise<jwksClient.SigningKey> {
    return Promise.resolve({
      kid: 'KIDKID',
      alg: 'RS256',
      getPublicKey: () => null,
      rsaPublicKey: null,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getJWTPayload(identityToken: string): jwt.Jwt {
    return {
      header: { alg: 'RS256', kid: 'KIDKID' },
      payload: {},
      signature: 'SIGNATURE'
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getKIDFromJWKS(jwks: AppleJWKS[], payload: jwt.Jwt): string {
    return 'KIDKID';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getIdentityTokenPayload(identityToken: string, signingKey: jwksClient.SigningKey): IdentityTokenPayload {
    return {
      sub: 'test_sub@apple.com',
      nonce: '',
      c_hash: '',
      email: 'test@apple.com',
      email_verified: true,
      is_private_email: '',
      auth_time: null
    };
  }
}
