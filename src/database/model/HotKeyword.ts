import * as dayjs from 'dayjs';
import { model, Model, Schema } from 'mongoose';
import { IHotKeyword } from '../../entity';
import { makeSchema } from './makeSchema';

const { String, Date } = Schema.Types;
const schema = makeSchema({
  groupChannelId: { type: String, ref: 'GroupChannel', required: true },
  words: [{ type: String, required: true }],
  from: { type: Date, required: true, default: dayjs().startOf('day') },
  to: { type: Date, required: true, default: dayjs().endOf('day') },
}, { collection: 'HotKeyword' });

export const HotKeywordModel = (): Model<IHotKeyword> => {
  return model<IHotKeyword>('HotKeyword', schema);
};
