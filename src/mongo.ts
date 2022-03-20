import { connect, Model } from 'mongoose';
import {
  AlertModel,
  HotKeywordModel,
  IAlert,
  IHotKeyword,
  IReactionStatistics,
  IScrap,
  ISession,
  IUser,
  IUserReaction,
  ReactionStatisticsModel,
  ScrapModel,
  SessionModel,
  UserModel,
  UserReactionModel
} from './model';

export const models: IMongoModels = MongoModels();

export function MongoModels(): IMongoModels {
  return {
    Alert: AlertModel(),
    HotKeyword: HotKeywordModel(),
    Scrap: ScrapModel(),
    User: UserModel(),
    UserReaction: UserReactionModel(),
    Session: SessionModel(),
    ReactionStatistics: ReactionStatisticsModel(),
  };
}

export async function connectToMongoDB(): Promise<typeof import('mongoose')> {
  return await connect(process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/piggy_chat');
}

export interface IMongoModels {
  Alert: Model<IAlert>;
  HotKeyword: Model<IHotKeyword>;
  Scrap: Model<IScrap>;
  User: Model<IUser>;
  UserReaction: Model<IUserReaction>;
  Session: Model<ISession>;
  ReactionStatistics: Model<IReactionStatistics>;
}
