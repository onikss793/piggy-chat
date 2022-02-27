import { mongoModels } from '../database';
import { IUser } from '../entity';

export async function doesUserExist(user: IUser): Promise<boolean> {
  const existingUser = await mongoModels.User.findOne({ nickname: user.nickname });
  return !!existingUser;
}

export async function saveUser(user: IUser): Promise<IUser> {
  return mongoModels.User.create({ ...user });
}

export async function isNicknameUnique(nickname: string): Promise<boolean> {
  const existingUser = await mongoModels.User.findOne({ nickname });
  return !existingUser;
}

export async function updateUserNickname(userId: string, nickname: string): Promise<IUser> {
  await mongoModels.User.updateOne({ id: userId }, { nickname });
  console.log('nickname updated', userId);
  return mongoModels.User.findOne({ id: userId });
}
