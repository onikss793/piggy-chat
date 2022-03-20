import { ObjectId } from 'mongoose';
import { IUserReaction, ReactionType } from '../model';
import { models } from '../mongo';

const { UserReaction } = models;

export async function addReaction(userId: ObjectId, messageId: string, reactionType: ReactionType): Promise<IUserReaction> {
  return UserReaction.findOneAndUpdate({ user: userId }, {
    $addToSet: {
      reactions: {
        messageId,
        reactionType
      }
    }
  }, { upsert: true, new: true });
}
