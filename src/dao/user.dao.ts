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
