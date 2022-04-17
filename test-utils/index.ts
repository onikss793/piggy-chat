import * as dayjs from 'dayjs';
import { ObjectId } from 'mongoose';
import { IHotKeyword, IReactionStatistics, IScrap, IUser, IUserReaction } from '../src/model';
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
    messageId: 1,
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
      { messageId: 1, reactionType: 'LIKE', groupChannelId: 'group_channel_1' },
      { messageId: 2, reactionType: 'LIKE', groupChannelId: 'group_channel_1' },
      { messageId: 3, reactionType: 'LIKE', groupChannelId: 'group_channel_1' },
    ],
  })).save();
}

export async function userReactionTeardown(): Promise<void> {
  await models.UserReaction.deleteMany();
}

export async function reactionStatsSetup(groupChannelId: string, messageId: number, reactionType: string, totalCount = 1): Promise<IReactionStatistics> {
  await reactionStatsTeardown();
  return (await models.ReactionStatistics.create({
    groupChannelId,
    messageId,
    reactionType,
    totalCount,
  })).save();
}

export async function reactionStatsTeardown(): Promise<void> {
  await models.ReactionStatistics.deleteMany();
}
