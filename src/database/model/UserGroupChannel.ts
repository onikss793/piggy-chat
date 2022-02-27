import { Model, model, Schema } from 'mongoose';
import { IUserGroupChannel } from '../../entity';
import { makeSchema } from './makeSchema';

const { String } = Schema.Types;
const schema = makeSchema<IUserGroupChannel>({
  userId: { type: String, required: true },
  groupChannelId: { type: String, ref: 'GroupChannel', required: true },
}, { collection: 'UserGroupChannel' });

export const UserGroupChannelModel = (): Model<IUserGroupChannel> => {
  return model('UserGroupChannel', schema);
};
