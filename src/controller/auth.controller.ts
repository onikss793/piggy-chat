import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { IAppleLoginDTO, IKakaoLoginDTO, ILoginDTO } from '../dto';
import { AuthService } from '../service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Post('/kakao')
  kakaoLogin(@Body() body: IKakaoLoginDTO): Promise<ILoginDTO> {
    if (!body.access_token) throw new UnauthorizedException('No access_token provided');

    return this.authService.kakaoLogin(body);
  }

  @Post('/apple')
  appleLogin(@Body() body: IAppleLoginDTO): Promise<ILoginDTO> {
    if (!body.identity_token) throw new UnauthorizedException('No access_token provided');

    return this.authService.appleLogin(body);
  }
}
