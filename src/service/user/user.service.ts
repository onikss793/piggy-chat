import { Injectable, NotFoundException } from '@nestjs/common';
import type { ObjectId } from 'mongoose';
import { UserDAO } from '../../dao';
import type { IUser } from '../../model';
import type { UserResponse } from './interface';

@Injectable()
export class UserService {
  isUserNicknameUnique(nickname: string): Promise<boolean> {
    return UserDAO.isNicknameUnique(nickname);
  }

  async updateUserNickname(userId: ObjectId, nickname: string): Promise<UserResponse> {
    const updatedUser = await UserDAO.updateUserInfo(userId, { nickname });
    return this.createUserResponse(updatedUser);
  }

  private createUserResponse = (user: IUser): UserResponse => {
    if (!user) {
      throw new NotFoundException('No user to make UserResponse');
    }

    return {
      id: user.id,
      nickname: user.nickname,
    };
  };
}
