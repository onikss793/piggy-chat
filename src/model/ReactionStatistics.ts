import { model, Model, Schema } from 'mongoose';
import { IReactionStatistics } from './interface';
import { makeSchema } from './makeSchema';

const { String, Number } = Schema.Types;
const schema = makeSchema<IReactionStatistics>({
  groupChannelUrl: { type: String, required: true },
  messageId: { type: String, required: true },
  reactions: [{
    reactionType: { type: String, required: true },
    totalCount: { type: Number, required: true },
  }]
}, { collection: 'ReactionStatistics' });

export const ReactionStatisticsModel = (): Model<IReactionStatistics> => {
  return model<IReactionStatistics>('ReactionStatistics', schema);
};
