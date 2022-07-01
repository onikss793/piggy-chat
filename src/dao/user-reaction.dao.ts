import type { ObjectId } from 'mongoose';
import type { IUserReaction, ReactionType } from '../model';
import { models } from '../mongo';

const { UserReaction } = models;

export async function addReaction(userId: ObjectId, messageId: number, reactionType: ReactionType, groupChannelId: string): Promise<IUserReaction> {
  return UserReaction.findOneAndUpdate({ user: userId }, {
    $addToSet: {
      reactions: {
        groupChannelId,
        messageId,
        reactionType,
      },
    },
  }, { upsert: true, new: true });
}

export async function deleteReaction(userId: ObjectId, messageId: number, reactionType: ReactionType, groupChannelId: string): Promise<IUserReaction> {
  return UserReaction.findOneAndUpdate({ user: userId }, {
    $pull: {
      reactions: {
        groupChannelId,
        messageId,
        reactionType,
      },
    },
  });
}
