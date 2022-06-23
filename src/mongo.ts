import { connect, Model } from 'mongoose';
import type { IAlert, IHotKeyword, IReactionStatistics, IScrap, ISession, IUser, IUserReaction } from './model';
import {
  AlertModel,
  HotKeywordModel,
  ReactionStatisticsModel,
  ScrapModel,
  SessionModel,
  UserModel,
  UserReactionModel,
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
  const username = process.env.MONGO_USERNAME;
  const password = encodeURIComponent(process.env.MONGO_PASSWORD);
  const cluster = process.env.MONGO_CLUSTER;
  const uri = ['local', 'nest'].includes(process.env.STAGE)
    ? 'mongodb://127.0.0.1:27017/piggy_chat'
    : `mongodb+srv://${username}:${password}@${cluster}.x82dl.mongodb.net/?retryWrites=true&w=majority`;

  return connect(uri);
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
