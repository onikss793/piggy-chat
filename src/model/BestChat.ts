import { model, Model, Schema } from 'mongoose';
import { IBestChat } from './interface';
import { makeSchema } from './makeSchema';

const { String, Number } = Schema.Types;
const schema = makeSchema<IBestChat>({
  messageId: { type: String, required: true },
  groupChannelUrl: { type: String, required: true },
  likeCount: { type: Number, required: true, default: 0 },
}, { collection: 'BestChat' });

export const BestChatModel = (): Model<IBestChat> => {
  return model<IBestChat>('BestChat', schema);
};
