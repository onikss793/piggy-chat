import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService, IAppleLoginDTO, IKakaoLoginDTO, ILoginDTO } from '../../service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 카카오로 회원가입 및 기가입자 재로그인 시
  @Post('/kakao')
  kakaoLogin(@Body() body: IKakaoLoginDTO): Promise<ILoginDTO> {
    if (!body.access_token) throw new UnauthorizedException('No access_token provided');

    return this.authService.kakaoLogin(body);
  }

  // 애플로 회원가입 및 기가입자 재로그인 시
  @Post('/apple')
  appleLogin(@Body() body: IAppleLoginDTO): Promise<ILoginDTO> {
    if (!body.identity_token) throw new UnauthorizedException('No access_token provided');

    return this.authService.appleLogin(body);
  }

  // access_token 갱신할 때 사용. refresh_token 사용
  @Get('/login')
  login(@Req() req: Request): Promise<ILoginDTO> {
    const authorization = req.headers['authorization'];
    const accessToken = authorization?.replace('Bearer ', '');
    const refreshToken = req.headers['refresh-token'] as string;
    if (!accessToken || !refreshToken) throw new UnauthorizedException('No token');

    return this.authService.login(accessToken, refreshToken);
  }

  // 사용자의 닉네임을 등록하는 API
  @Post('/nickname')
  async isNicknameUnique(@Body('nickname') nickname: string): Promise<{ isUnique: boolean }> {
    const isUnique = await this.authService.isNicknameUnique(nickname);

    return { isUnique: isUnique };
  }
}
