import { Module } from '@nestjs/common';
import { Symbols } from '../symbols';
import { AppleHandler } from './apple';
import { KakaoHandler } from './kakao';

@Module({
  imports: [],
  providers: [
    { provide: Symbols.IAppleHandler, useClass: AppleHandler },
    { provide: Symbols.IKakaoHandler, useClass: KakaoHandler },
  ],
  exports: [
    { provide: Symbols.IAppleHandler, useClass: AppleHandler },
    { provide: Symbols.IKakaoHandler, useClass: KakaoHandler },
  ]
})
export class ExternalModule {}
