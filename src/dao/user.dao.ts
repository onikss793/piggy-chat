import { FilterQuery } from 'mongoose';
import { mongoModels } from '../database';
import { IUser } from '../entity';

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
