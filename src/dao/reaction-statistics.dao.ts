import { models } from '../mongo';

const { ReactionStatistics } = models;

export const upsertReactionStats = (groupChannelId: string, messageId: number, reactionType: string) => {
  return incAndDecReactionStats(messageId, reactionType, groupChannelId, 1);
};

export const decreaseReactionStats = (groupChannelId: string, messageId: number, reactionType: string) => {
  return incAndDecReactionStats(messageId, reactionType, groupChannelId, -1);
};

const incAndDecReactionStats = (messageId: number, reactionType: string, groupChannelId: string, count: number) => {
  return ReactionStatistics.findOneAndUpdate({
      groupChannelId,
      messageId,
      reactionType,
    },
    { $inc: { totalCount: count } },
    { upsert: true },
  );
};

export const findReactionStatsByMessageIds = (messageIds: number[]) => {
  return ReactionStatistics.find({ messageId: { $in: messageIds }, reactionType: 'LIKE' });
};
