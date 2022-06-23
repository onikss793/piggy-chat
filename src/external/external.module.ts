import { Module } from '@nestjs/common';
import { Symbols } from '../symbols';
import { AppleHandler } from './apple';
import { JWTHandler } from './jsonwebtoken';
import { KakaoHandler } from './kakao';
import { SendBirdHandler } from './send-bird';

@Module({
  providers: [
    { provide: Symbols.IAppleHandler, useClass: AppleHandler },
    { provide: Symbols.IKakaoHandler, useClass: KakaoHandler },
    { provide: Symbols.IJWTHandler, useClass: JWTHandler },
    { provide: Symbols.ISendBirdHandler, useClass: SendBirdHandler },
  ],
  exports: [
    { provide: Symbols.IAppleHandler, useClass: AppleHandler },
    { provide: Symbols.IKakaoHandler, useClass: KakaoHandler },
    { provide: Symbols.IJWTHandler, useClass: JWTHandler },
    { provide: Symbols.ISendBirdHandler, useClass: SendBirdHandler },
  ],
})
export class ExternalModule {}
