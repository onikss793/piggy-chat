import * as dayjs from 'dayjs';
import { model, Model, Schema } from 'mongoose';
import { IHotKeyword } from './interface';
import { makeSchema } from './makeSchema';

const { String, Date } = Schema.Types;
const schema = makeSchema<IHotKeyword>({
  groupChannelUrl: { type: String, required: true },
  words: [{ type: String, required: true }],
  from: { type: Date, required: true, default: dayjs().startOf('day').toDate() },
  to: { type: Date, required: true, default: dayjs().endOf('day').toDate() },
}, { collection: 'HotKeyword' });

export const HotKeywordModel = (): Model<IHotKeyword> => {
  return model<IHotKeyword>('HotKeyword', schema);
};
