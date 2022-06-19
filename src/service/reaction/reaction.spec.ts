import { first, last } from 'lodash';
import { reactionStatsTeardown, userReactionSetup, userReactionTeardown, userSetup } from '../../../test-utils';
import { MockSendBirdHandler } from '../../external/send-bird';
import { ReactionType } from '../../model';
import { connectToMongoDB, MongoModels } from '../../mongo';
import { ReactionService } from './reaction.service';

let mongoose: typeof import('mongoose');

beforeAll(async () => {
  mongoose = await connectToMongoDB();
});
afterAll(async () => {
  await mongoose?.connection.close();
});

describe('ReactionService', () => {
  const reactionService = new ReactionService(new MockSendBirdHandler());
  const models = MongoModels();

  test('addReaction() should return added UserReaction', async () => {
    await userReactionTeardown();
    await reactionStatsTeardown();
    const user = await userSetup();
    const messageIds = ['1', '2', '3'];
    const reactions = [];

    for (const messageId of messageIds) {
      const userReaction = await reactionService.addReaction(user.id, messageId, ReactionType.LIKE, 'group_channel_id');
      reactions.push(last(userReaction.reactions));
      expect(userReaction).toEqual({
        userId: String(user.id),
        reactions,
      });
    }

    const userReactions = await models.UserReaction.find();
    expect(userReactions.length).toBe(1);

    const reactionStats = await models.ReactionStatistics.find();
    reactionStats.forEach(stat => {
      expect(stat.totalCount).toEqual(1);
    });
  });

  test('deleteReaction() should pull out userReaction', async () => {
    await reactionStatsTeardown();
    const user = await userSetup();
    const userReaction = await userReactionSetup(user.id);

    const reaction = first(userReaction.reactions);
    await reactionService.deleteReaction(user.id, reaction.messageId, reaction.reactionType, reaction.groupChannelId);

    const userReactions = await models.UserReaction.findOne({ user: user.id });
    expect(userReactions.reactions.length).toEqual(2);
    expect(userReactions.reactions.find(r => r.messageId === 1)).toBeUndefined();

    const reactionStats = await models.ReactionStatistics.find();
    expect(reactionStats.find(stat => stat.messageId === 1).totalCount).toBe(-1);
  });

  // test('getBestChat() 는 24시간 내 가장 많은 좋아요를 받은 3개의 messageId 를 반환한다', async () => {
  //   const user = await userSetup();
  //   const userReaction = await userReactionSetup(user.id);
  //   await Promise.all(userReaction.reactions.map(async ({ messageId, reactionType, groupChannelId }, i) => {
  //     await reactionStatsSetup(groupChannelId, messageId, reactionType, i + 1);
  //   }));
  //
  //   const bestChat = await reactionService.getBestChat();
  //   log(bestChat);
  //   // const res = await models.ReactionStatistics.find();
  //   // log(res);
  // });
});
