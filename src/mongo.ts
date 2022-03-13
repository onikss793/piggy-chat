import { connect, Model } from 'mongoose';
import {
  AlertModel,
  BestChatModel,
  HotKeywordModel,
  IAlert,
  IBestChat,
  IHotKeyword,
  IScrap,
  ISession,
  IUser,
  ScrapModel,
  SessionModel,
  UserModel,
} from './model';

export const models: IMongoModels = MongoModels();

export function MongoModels(): IMongoModels {
  return {
    Alert: AlertModel(),
    BestChat: BestChatModel(),
    HotKeyword: HotKeywordModel(),
    Scrap: ScrapModel(),
    User: UserModel(),
    Session: SessionModel(),
  };
}

export async function connectToMongoDB(): Promise<typeof import('mongoose')> {
  return await connect(process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/piggy_chat');
}

export interface IMongoModels {
  Alert: Model<IAlert>;
  BestChat: Model<IBestChat>;
  HotKeyword: Model<IHotKeyword>;
  Scrap: Model<IScrap>;
  User: Model<IUser>;
  Session: Model<ISession>;
}
