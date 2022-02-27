import { IUserDTO } from '../../dto/user.dto';

export interface IUserService {
  isUserNicknameUnique(nickname: string): Promise<boolean>;
  updateUserNickname(userId: string, nickname: string): Promise<IUserDTO>;
}
