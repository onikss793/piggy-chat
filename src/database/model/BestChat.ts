import { model, Model, Schema } from 'mongoose';
import { IBestChat } from '../../entity';
import { makeSchema } from './makeSchema';

const { String, Number } = Schema.Types;
const schema = makeSchema({
  messageId: { type: String, required: true },
  groupChannelId: { type: String, ref: 'GroupChannel', required: true },
  likeCount: { type: Number, required: true, default: 0 },
}, { collection: 'BestChat' });

export const BestChatModel = (): Model<IBestChat> => {
  return model<IBestChat>('BestChat', schema);
};
