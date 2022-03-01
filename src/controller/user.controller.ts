import { Body, ConflictException, Controller, Patch } from '@nestjs/common';
import { IUserDTO, UserService } from '../service';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Patch('')
  async updateUserInfo(@Body() body: { nickname: string }): Promise<IUserDTO> {
    const userId = '61d400f45031f5f46afebb62'; // TODO: get usrId from the token;
    const isNicknameUnique = await this.userService.isUserNicknameUnique(body.nickname);
    console.log(isNicknameUnique);
    if (!isNicknameUnique) throw new ConflictException(`${body.nickname} already exists in the server`);

    return this.userService.updateUserNickname(userId, body.nickname);
  }
}
