import { Body, ConflictException, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { IUserDTO, UserService } from '../../service';
import { UserGuard } from '../../util';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  // 사용자 프로필 업데이트(현재는 닉네임만 업데이트)
  @Patch('/')
  @UseGuards(UserGuard)
  async updateUserInfo(@Req() req: Request, @Body() body: { nickname: string }): Promise<IUserDTO> {
    const userId = req['userId'];
    const isNicknameUnique = await this.userService.isUserNicknameUnique(body.nickname);
    if (!isNicknameUnique) throw new ConflictException(`${body.nickname} already exists in the server`);

    return this.userService.updateUserNickname(userId, body.nickname);
  }
}
