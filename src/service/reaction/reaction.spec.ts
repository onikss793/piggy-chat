import { first, last } from 'lodash';
import { userReactionSetup, userReactionTeardown, userSetup } from '../../../test-utils';
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
  const reactionService = new ReactionService();

  test('addReaction() should return added UserReaction', async () => {
    await userReactionTeardown();
    const user = await userSetup();
    const messageIds = ['message_id_1', 'message_id_2', 'message_id_3'];
    const reactions = [];

    for (const messageId of messageIds) {
      const userReaction = await reactionService.addReaction(user.id, messageId, 'LIKE');
      reactions.push(last(userReaction.reactions));
      expect(userReaction).toEqual({
        userId: String(user.id),
        reactions,
      });
    }

    const result = await MongoModels().UserReaction.find();
    expect(result.length).toBe(1);
  });

  test('deleteReaction() should pull out userReaction', async () => {
    const user = await userSetup();
    const userReaction = await userReactionSetup(user.id);

    const reaction = first(userReaction.reactions);
    await reactionService.deleteReaction(user.id, reaction.messageId, reaction.reactionType);

    const userReactions = await MongoModels().UserReaction.findOne({ user: user.id });
    expect(userReactions.reactions.length).toEqual(2);
    expect(userReactions.reactions.find(r => r.messageId === 'message_id_1')).toBeUndefined();
  });
});
