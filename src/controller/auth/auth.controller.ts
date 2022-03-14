import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService, IAppleLoginDTO, IKakaoLoginDTO, ILoginDTO } from '../../service';

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
  login(@Req() req: Request): Promise<ILoginDTO> {
    const authorization = req.headers['authorization'];
    const accessToken = authorization?.replace('Bearer ', '');
    const refreshToken = req.headers['refresh-token'] as string;
    if (!accessToken || !refreshToken) throw new UnauthorizedException('No token');

    return this.authService.login(accessToken, refreshToken);
  }
}
