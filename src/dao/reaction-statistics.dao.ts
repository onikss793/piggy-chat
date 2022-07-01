import type { IReactionStatistics } from '../model';
import { models } from '../mongo';

const { ReactionStatistics } = models;

export const upsertReactionStats = async (groupChannelId: string, messageId: number, reactionType: string): Promise<IReactionStatistics> => {
  return incAndDecReactionStats(messageId, reactionType, groupChannelId, 1);
};

export const decreaseReactionStats = async (groupChannelId: string, messageId: number, reactionType: string): Promise<IReactionStatistics> => {
  return incAndDecReactionStats(messageId, reactionType, groupChannelId, -1);
};

const incAndDecReactionStats = async (messageId: number, reactionType: string, groupChannelId: string, count: number): Promise<IReactionStatistics> => {
  return ReactionStatistics.findOneAndUpdate({
      groupChannelId,
      messageId,
      reactionType,
    },
    { $inc: { totalCount: count } },
    { upsert: true },
  );
};

export const findReactionStatsByMessageIds = async (messageIds: number[]): Promise<IReactionStatistics[]> => {
  return ReactionStatistics.find({ messageId: { $in: messageIds }, reactionType: 'LIKE' });
};
