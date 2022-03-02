import { model, Model, Schema } from 'mongoose';
import { IAlert } from './interface';
import { makeSchema } from './makeSchema';

const { String, Boolean, ObjectId } = Schema.Types;
const schema = makeSchema<IAlert>({
  action: { type: String, required: true },
  user: { type: ObjectId, ref: 'User', required: true },
  groupChannelUrl: { type: String, required: false },
  messageId: { type: String, required: true },
  isViewed: { type: Boolean, required: true },
}, { collection: 'Alert' });

export const AlertModel = (): Model<IAlert> => {
  return model<IAlert>('Alert', schema);
};
