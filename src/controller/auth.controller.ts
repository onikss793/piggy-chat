import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ILoginDTO } from '../dto';
import { IAppleLoginDTO, IAuthService, IKakaoLoginDTO } from '../service';
import { SYMBOL } from '../symbols';

@Controller('/auth')
export class AuthController {
  constructor(@Inject(SYMBOL.IAuthService) private readonly authService: IAuthService) {}

  @Post('/kakao')
	kakaoLogin(@Body() body: IKakaoLoginDTO): Promise<ILoginDTO> {
		return this.authService.kakaoLogin(body);
	}

	@Post('/apple')
	appleLogin(@Body() body: IAppleLoginDTO): Promise<ILoginDTO> {
		return this.authService.appleLogin(body);
	}
}
