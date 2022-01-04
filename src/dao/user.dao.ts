import { IUser } from '../entity';

export async function doesUserExist(user: IUser): Promise<boolean> {
  // findUserWithAccount;
  console.log(user);
  return Promise.resolve(false);
}

export async function saveUser(user: IUser): Promise<IUser> {
  return Promise.resolve({
    ...user,
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  });
}

export async function isNicknameUnique(nickname: string): Promise<boolean> {
  nickname;
  return Promise.resolve(true);
}

export async function updateUserNickname(userId: number, nickname: string): Promise<IUser> {
  console.log('nickname updated');
  return Promise.resolve({
    id: userId,
    nickname
  } as IUser);
}
