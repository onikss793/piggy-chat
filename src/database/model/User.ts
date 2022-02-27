import { Model, model, Schema } from 'mongoose';
import { IUser } from '../../entity';
import { makeSchema } from './makeSchema';

const { String, Boolean } = Schema.Types;
const schema = makeSchema<IUser>({
  account: { type: String, required: true },
  oauthKind: { type: String, required: true },
  nickname: { type: String, required: false, unique: true },
  phoneNumber: { type: String, required: false },
  verified: { type: Boolean, require: true, defaultValue: false },
}, { collection: 'User' });

export const UserModel = (): Model<IUser> => {
  return model<IUser>('User', schema);
};
