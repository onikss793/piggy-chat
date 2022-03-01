import { Module } from '@nestjs/common';
import { SYMBOL } from '../symbols';
import { AppleHandler } from './apple';
import { KakaoHandler } from './kakao';

@Module({
  imports: [],
  providers: [
    { provide: SYMBOL.IAppleHandler, useClass: AppleHandler },
    { provide: SYMBOL.IKakaoHandler, useClass: KakaoHandler },
  ],
  exports: [
    { provide: SYMBOL.IAppleHandler, useClass: AppleHandler },
    { provide: SYMBOL.IKakaoHandler, useClass: KakaoHandler },
  ]
})
export class ExternalModule {}
