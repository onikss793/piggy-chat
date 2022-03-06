import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { UserDAO } from '../../dao';
import { IUser } from '../../model';
import { IUserDTO } from './interface';

@Injectable()
export class UserService {
  isUserNicknameUnique(nickname: string): Promise<boolean> {
    return UserDAO.isNicknameUnique(nickname);
  }

  async updateUserNickname(userId: ObjectId, nickname: string): Promise<IUserDTO> {
    const updatedUser = await UserDAO.updateUserInfo(userId, { nickname });
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
