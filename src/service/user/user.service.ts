import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isNicknameUnique, updateUserNickname } from '../../dao';
import { IUserDTO } from '../../dto';
import { IUser } from '../../entity';
import { log } from '../../util';
import { IUserService } from './interface';

@Injectable()
export class UserService implements IUserService {
  isUserNicknameUnique(nickname: string): Promise<boolean> {
    return isNicknameUnique(nickname);
  }

  async updateUserNickname(userId: string, nickname: string): Promise<IUserDTO> {
    const updatedUser = await updateUserNickname(userId, nickname);
    log(updatedUser);
    return this.createUserDTO(updatedUser);
  }

  private createUserDTO = (user: IUser): IUserDTO => {
    if (!user) {
      throw new InternalServerErrorException('No user to make DTO');
    }

    return {
      id: user.id,
      nickname: user.nickname
    };
  };
}
