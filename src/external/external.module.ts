import { Module } from '@nestjs/common';
import { AppleHandler } from './apple';

@Module({
	imports: [],
	providers: [AppleHandler],
	exports: [AppleHandler]
})
export class ExternalModule {}
