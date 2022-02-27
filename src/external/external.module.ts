import { Module } from '@nestjs/common';
import { AppleHandler } from './apple';
import { KakaoHandler } from './kakao';

@Module({
	imports: [],
	providers: [AppleHandler, KakaoHandler],
	exports: [AppleHandler, KakaoHandler]
})
export class ExternalModule {}
