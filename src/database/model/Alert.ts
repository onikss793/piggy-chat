import { model, Model, Schema } from 'mongoose';
import { IAlert } from '../../entity';
import { makeSchema } from './makeSchema';

const { String, Boolean } = Schema.Types;
const schema = makeSchema({
  action: { type: String, required: true },
  userId: { type: String, ref: 'User', required: true },
  groupChannelId: { type: String, ref: 'GroupChannel', required: true },
  messageId: { type: String, required: true },
  isViewed: { type: Boolean, required: true },
}, { collection: 'Alert' });

export const AlertModel = (): Model<IAlert> => {
  return model<IAlert>('Alert', schema);
};
