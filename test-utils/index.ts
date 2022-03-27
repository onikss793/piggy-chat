import * as dayjs from 'dayjs';
import { ObjectId } from 'mongoose';
import { IHotKeyword, IScrap, IUser, IUserReaction } from '../src/model';
import { models } from '../src/mongo';

export async function sessionTeardown(): Promise<void> {
  await models.Session.deleteMany();
}

export async function userSetup(nickname = 'nickname'): Promise<IUser> {
  await userTeardown();
  return (await models.User.create({
    account: 'account',
    oauthKind: 'APPLE',
    nickname,
  })).save();
}

export async function userTeardown(): Promise<void> {
  await models.User.deleteMany();
}

export async function scrapSetup(userId: ObjectId): Promise<IScrap> {
  await scrapTeardown();
  return (await models.Scrap.create({
    user: userId,
    groupChannelUrl: 'SETUP_GROUP_CHANNEL_URL',
    messageId: 'SETUP_MESSAGE_ID',
  })).save();
}

export async function scrapTeardown(): Promise<void> {
  await models.Scrap.deleteMany();
}

export async function hotKeywordSetup(): Promise<IHotKeyword> {
  await hotKeywordTeardown();
  return (await models.HotKeyword.create({
    groupChannelUrl: 'GROUP_CHANNEL_URL',
    words: ['HELLO', 'WORLD', 'FOO', 'BAR', 'BAZ'],
    from: dayjs().startOf('day'),
    to: dayjs().endOf('day'),
  })).save();
}

export async function hotKeywordTeardown(): Promise<void> {
  await models.HotKeyword.deleteMany();
}

export async function userReactionSetup(userId: ObjectId): Promise<IUserReaction> {
  await userReactionTeardown();
  return (await models.UserReaction.create({
    user: userId,
    reactions: [
      { messageId: 'message_id_1', reactionType: 'LIKE' },
      { messageId: 'message_id_2', reactionType: 'LIKE' },
      { messageId: 'message_id_3', reactionType: 'LIKE' },
    ],
  })).save();
}

export async function userReactionTeardown(): Promise<void> {
  await models.UserReaction.deleteMany();
}
