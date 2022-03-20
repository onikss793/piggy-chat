import { model, Model, Schema } from 'mongoose';
import { IUserReaction } from './interface';
import { makeSchema } from './makeSchema';

const { String, ObjectId } = Schema.Types;
const schema = makeSchema<IUserReaction>({
  user: { type: ObjectId, ref: 'User', required: true },
  reactions: [{
    messageId: { type: String, required: true },
    reactionType: { type: String, required: true },
  }]
}, { collection: 'UserReaction' });

export const UserReactionModel = (): Model<IUserReaction> => {
  return model<IUserReaction>('UserReaction', schema);
};
