import type { FilterQuery, ObjectId, UpdateQuery } from 'mongoose';
import type { IUser } from '../model';
import { models } from '../mongo';

const { User } = models;

export async function findUser(option: FilterQuery<IUser>): Promise<IUser> {
  return User.findOne({ ...option });
}

export async function doesAccountExists(account: string): Promise<boolean> {
  const existingUser = await User.findOne({ account });
  return !!existingUser;
}

export async function initialSignUpUser(user: Omit<IUser, 'nickname'>): Promise<IUser> {
  return (await User.create({ ...user })).save();
}

export async function saveUser(user: IUser): Promise<IUser> {
  return (await User.create({ ...user })).save();
}

export async function isNicknameUnique(nickname: string): Promise<boolean> {
  const existingUser = await User.findOne({ nickname });
  return !existingUser;
}

export async function updateUserNickname(userId: ObjectId, nickname: string): Promise<IUser> {
  await User.updateOne({ id: userId }, { nickname });
  return User.findOne({ id: userId });
}

export async function updateUserInfo(userId: ObjectId, info: UpdateQuery<IUser>): Promise<IUser> {
  await User.updateOne({ id: userId }, { ...info });
  return User.findOne({ id: userId });
}
