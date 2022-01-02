import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ILoginDTO } from '../dto';
import { IAppleLoginDTO, IAuthService } from '../service';
import { SYMBOL } from '../symbols';

@Controller('/auth')
export class AuthController {
  constructor(@Inject(SYMBOL.IAuthService) private readonly authService: IAuthService) {}

  @Post('/kakao')
	kakaoLogin() {
		return this.authService.kakaoLogin();
	}

	@Post('/apple')
	appleLogin(@Body() body: IAppleLoginDTO): Promise<ILoginDTO> {
		return this.authService.appleLogin(body);
	}
}
