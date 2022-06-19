import { ObjectId } from 'mongoose';
import { IUserReaction, ReactionType } from '../model';
import { models } from '../mongo';

const { UserReaction } = models;

export async function addReaction(userId: ObjectId, messageId: string, reactionType: ReactionType, groupChannelId: string): Promise<IUserReaction> {
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

export async function deleteReaction(userId: ObjectId, messageId: string, reactionType: ReactionType, groupChannelId: string): Promise<IUserReaction> {
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
