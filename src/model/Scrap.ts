import { model, Model, Schema } from 'mongoose';
import { IScrap } from './interface';
import { makeSchema } from './makeSchema';

const { String, ObjectId, Number } = Schema.Types;
const schema = makeSchema<IScrap>({
  user: { type: ObjectId, ref: 'User', required: true },
  groupChannelUrl: { type: String, required: true },
  messageId: { type: Number, unique: true, required: true },
}, { collection: 'Scrap' });

export const ScrapModel = (): Model<IScrap> => {
  return model<IScrap>('Scrap', schema);
};
