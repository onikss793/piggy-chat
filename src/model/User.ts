import { Model, model, Schema } from 'mongoose';
import { IUser, OauthKind } from './interface';
import { makeSchema } from './makeSchema';

const { String, Boolean } = Schema.Types;
const schema = makeSchema<IUser>({
  account: { type: String, required: true },
  oauthKind: { type: String, enum: OauthKind, required: true },
  nickname: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: false },
  verified: { type: Boolean, required: false, defaultValue: false },
  currentUserGroupChannelUrl: { type: String, required: false },
}, { collection: 'User' });

export const UserModel = (): Model<IUser> => {
  return model<IUser>('User', schema);
};
