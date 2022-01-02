import { Module } from '@nestjs/common';
import { ExternalModule } from '../external/external.module';
import { SYMBOL } from '../symbols';
import { AuthService } from './auth';

@Module({
	imports: [ExternalModule],
	providers: [
		{ provide: SYMBOL.IAuthService, useClass: AuthService },
	],
	exports: [
		{ provide: SYMBOL.IAuthService, useClass: AuthService },
	]
})
export class ServiceModule {}
