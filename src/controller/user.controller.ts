import { Body, ConflictException, Controller, Inject, Patch } from '@nestjs/common';
import { IUserDTO } from '../dto';
import { IUserService } from '../service';
import { SYMBOL } from '../symbols';

@Controller('/user')
export class UserController {
  constructor(@Inject(SYMBOL.IUserService) private readonly userService: IUserService) {}

  @Patch()
  async updateUserInfo(@Body() body: { nickname: string }): Promise<IUserDTO> {
    const userId = 1; // TODO: get usrId from the token;
    const isNicknameUnique = await this.userService.isUserNicknameUnique(body.nickname);

    if (!isNicknameUnique) throw new ConflictException(`${body.nickname} already exists in the server`);

    return this.userService.updateUserNickname(userId, body.nickname);
  }
}
