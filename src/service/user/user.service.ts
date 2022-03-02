import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserDAO } from '../../dao';
import { IUser } from '../../model';
import { IUserDTO } from './interface';

@Injectable()
export class UserService {
  isUserNicknameUnique(nickname: string): Promise<boolean> {
    return UserDAO.isNicknameUnique(nickname);
  }

  // async joinGroupChannel(userId: string, groupChannelUrl: string): Promise<IUserDTO> {
  //   const user = await UserDAO.findUser({ id: userId });
  //   const userGroupChannel = user.userGroupChannel;
  //   userGroupChannel.push({ channelUrl: groupChannelUrl });
  //   const updatedUser = await UserDAO.updateUserInfo(userId, { userGroupChannel });
  //   return this.createUserDTO(updatedUser);
  // }

  async updateUserNickname(userId: string, nickname: string): Promise<IUserDTO> {
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
