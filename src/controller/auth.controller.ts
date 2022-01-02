import { Body, Controller, Post } from '@nestjs/common';
import { ILoginDTO } from '../dto';
import { AuthService, IAppleLoginDTO } from '../service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/kakao')
	kakaoLogin() {
		return this.authService.kakaoLogin();
	}

	@Post('/apple')
	appleLogin(@Body() body: IAppleLoginDTO): Promise<ILoginDTO> {
		return this.authService.appleLogin(body);
	}
}
