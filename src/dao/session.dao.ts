import { ObjectId } from 'mongoose';
import { ISession } from '../model';
import { models } from '../mongo';

const { Session } = models;

export async function saveRefreshToken(userId: ObjectId, sessionId: string): Promise<ISession> {
  return (await Session.create({ sessionId, userId })).save();
}

export async function upsertSessionId(userId: ObjectId, sessionId: string): Promise<ISession> {
  return Session.findOneAndUpdate({ userId }, { sessionId }, { upsert: true });
}

export async function findSessionBySessionId(sessionId: string): Promise<ISession> {
  return Session.findOne({ sessionId });
}
