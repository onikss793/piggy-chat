import { ObjectId } from 'mongoose';
import { IScrap, IUser } from '../model';
import { mongoModels } from '../mongo';

export async function userSetup(nickname = 'nickname'): Promise<IUser> {
  await userTeardown();
  return (await mongoModels.User.create({
    account: 'account',
    oauthKind: 'APPLE',
    nickname,
  })).save();
}

export async function userTeardown(): Promise<void> {
  await mongoModels.User.deleteMany();
}

export async function scrapSetup(userId: ObjectId): Promise<IScrap> {
  await scrapTeardown();
  return (await mongoModels.Scrap.create({
    user: userId,
    groupChannelUrl: 'SETUP_GROUP_CHANNEL_URL',
    messageId: 'SETUP_MESSAGE_ID',
  })).save();
}

export async function scrapTeardown(): Promise<void> {
  await mongoModels.Scrap.deleteMany();
}
