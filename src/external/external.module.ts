import { Module } from '@nestjs/common';
import { Symbols } from '../symbols';
import { AppleHandler } from './apple';
import { JWTHandler } from './jsonwebtoken';
import { KakaoHandler } from './kakao';

@Module({
  providers: [
    { provide: Symbols.IAppleHandler, useClass: AppleHandler },
    { provide: Symbols.IKakaoHandler, useClass: KakaoHandler },
    { provide: Symbols.IJWTHandler, useClass: JWTHandler },
  ],
  exports: [
    { provide: Symbols.IAppleHandler, useClass: AppleHandler },
    { provide: Symbols.IKakaoHandler, useClass: KakaoHandler },
    { provide: Symbols.IJWTHandler, useClass: JWTHandler },
  ]
})
export class ExternalModule {}
