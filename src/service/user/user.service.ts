import { Injectable } from '@nestjs/common';
import { isNicknameUnique, updateUserNickname } from '../../dao';
import { IUserDTO } from '../../dto/user.dto';
import { IUser } from '../../entity';
import { IUserService } from './interface';


@Injectable()
export class UserService implements IUserService {
  isUserNicknameUnique(nickname: string): Promise<boolean> {
    return isNicknameUnique(nickname);
  }

  async updateUserNickname(userId: number, nickname: string): Promise<IUserDTO> {
    const updatedUser = await updateUserNickname(userId, nickname);
    return this.createUserDTO(updatedUser);
  }

  private createUserDTO(user: IUser): IUserDTO {
    return {
      id: user.id,
      nickname: user.nickname
    }
  }
}
