import { Module } from '@nestjs/common';
import { UserService } from '.';
import { ExternalModule } from '../external/external.module';
import { SYMBOL } from '../symbols';
import { AuthService } from './auth';

@Module({
	imports: [ExternalModule],
	providers: [
		{ provide: SYMBOL.IAuthService, useClass: AuthService },
		{ provide: SYMBOL.IUserService, useClass: UserService },
	],
	exports: [
		{ provide: SYMBOL.IAuthService, useClass: AuthService },
		{ provide: SYMBOL.IUserService, useClass: UserService },
	]
})
export class ServiceModule {}
