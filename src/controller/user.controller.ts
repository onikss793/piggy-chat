import { Body, ConflictException, Controller, Patch, Req, Request, UseGuards } from '@nestjs/common';
import { IUserDTO, UserService } from '../service';
import { UserGuard } from '../util';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Patch('')
  @UseGuards(UserGuard)
  async updateUserInfo(@Req() req: Request, @Body() body: { nickname: string }): Promise<IUserDTO> {
    const userId = req['userId'];
    const isNicknameUnique = await this.userService.isUserNicknameUnique(body.nickname);
    if (!isNicknameUnique) throw new ConflictException(`${body.nickname} already exists in the server`);

    return this.userService.updateUserNickname(userId, body.nickname);
  }
}
