import { Model, model, Schema } from 'mongoose';
import { IGroupChannel } from '../../entity';
import { makeSchema } from './makeSchema';

const { String } = Schema.Types;
const schema = makeSchema<IGroupChannel>({
  channelUrl: { type: String, required: true }
}, { collection: 'GroupChannel' });

export const GroupChannelModel = (): Model<IGroupChannel> => {
  return model('GroupChannel', schema);
};
