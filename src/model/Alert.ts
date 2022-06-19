import { model, Model, Schema } from 'mongoose';
import type { IAlert } from './interface';
import { makeSchema } from './makeSchema';

const { String, Boolean, ObjectId, Number } = Schema.Types;
const schema = makeSchema<IAlert>({
  alertTo: { type: ObjectId, required: true },
  action: { type: String, required: true },
  from: { type: ObjectId, ref: 'User', required: true },
  to: { type: ObjectId, ref: 'User', required: true },
  groupChannelUrl: { type: String, required: false },
  messageId: { type: Number, required: true },
  isViewed: { type: Boolean, required: true },
}, { collection: 'Alert' });

export const AlertModel = (): Model<IAlert> => {
  return model<IAlert>('Alert', schema);
};
