import { BadRequestException, Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import type { IAppleLoginDTO, IKakaoLoginDTO, LoginResponse } from '../../service';
import { AuthService } from '../../service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 카카오로 회원가입 및 기가입자 재로그인 시
  @Post('/kakao')
  kakaoLogin(@Body() body: IKakaoLoginDTO): Promise<LoginResponse> {
    if (!body.accessToken) throw new BadRequestException('No access_token provided');

    return this.authService.kakaoLogin(body);
  }

  // 애플로 회원가입 및 기가입자 재로그인 시
  @Post('/apple')
  appleLogin(@Body() body: IAppleLoginDTO): Promise<LoginResponse> {
    if (!body.identityToken) throw new BadRequestException('No identityToken provided');

    return this.authService.appleLogin(body);
  }

  // access_token 갱신할 때 사용. refresh_token 사용
  @Get('/login')
  login(@Req() req: Request): Promise<LoginResponse> {
    const authorization = req.headers['authorization'];
    const accessToken = authorization?.replace('Bearer ', '');
    const refreshToken = req.headers['refresh-token'] as string;
    if (!accessToken || !refreshToken) throw new BadRequestException('No token');

    return this.authService.login(accessToken, refreshToken);
  }

  @Post('/nickname')
  async isNicknameUnique(@Body('nickname') nickname: string): Promise<{ isUnique: boolean }> {
    const isUnique = await this.authService.isNicknameUnique(nickname);

    return { isUnique: isUnique };
  }
}
