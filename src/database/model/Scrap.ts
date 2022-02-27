import { model, Model, Schema } from 'mongoose';
import { IScrap } from '../../entity';
import { makeSchema } from './makeSchema';

const { String } = Schema.Types;
const schema = makeSchema({
  userId: { type: String, ref: 'User' },
  groupChannelId: { type: String, ref: 'GroupChannel' },
  messageId: { type: String, unique: true },
}, { collection: 'Scrap' });

export const ScrapModel = (): Model<IScrap> => {
  return model<IScrap>('Scrap', schema);
};
