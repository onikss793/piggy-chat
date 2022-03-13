import { Model, model, Schema } from 'mongoose';
import { ISession } from './interface';
import { makeSchema } from './makeSchema';

const { String, ObjectId } = Schema.Types;
const schema = makeSchema<ISession>({
  userId: { type: ObjectId, required: true },
  sessionId: { type: String, required: true },
}, { collection: 'Session' });

export const SessionModel = (): Model<ISession> => {
  return model<ISession>('Session', schema);
};
