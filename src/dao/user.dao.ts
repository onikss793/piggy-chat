import { FilterQuery, UpdateQuery } from 'mongoose';
import { IUser } from '../model';
import { mongoModels } from '../mongo';

export async function findUser(option: FilterQuery<IUser>): Promise<IUser> {
  return mongoModels.User.findOne({ ...option });
}

export async function doesUserExist(user: IUser): Promise<boolean> {
  const existingUser = await mongoModels.User.findOne({ account: user.account, nickname: user.nickname });
  return !!existingUser;
}

export async function saveUser(user: IUser): Promise<IUser> {
  return (await mongoModels.User.create({ ...user })).save();
}

export async function isNicknameUnique(nickname: string): Promise<boolean> {
  const existingUser = await mongoModels.User.findOne({ nickname });
  return !existingUser;
}

export async function updateUserNickname(userId: string, nickname: string): Promise<IUser> {
  await mongoModels.User.updateOne({ id: userId }, { nickname });
  return mongoModels.User.findOne({ id: userId });
}

export async function updateUserInfo(userId: string, info: UpdateQuery<IUser>): Promise<IUser> {
  await mongoModels.User.updateOne({ id: userId }, { ...info });
  return mongoModels.User.findOne({ id: userId });
}
