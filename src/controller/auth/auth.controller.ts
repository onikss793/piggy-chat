import { Body, Controller, Get, Post, Req, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService, IAppleLoginDTO, IKakaoLoginDTO, ILoginDTO } from '../../service';
import { UserGuard } from '../../util';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Get('/login')
  @UseGuards(UserGuard)
  login(@Req() req: Request): Promise<ILoginDTO> {
    const userId: string = req['userId'];

    return this.authService.login(userId);
  }
}
