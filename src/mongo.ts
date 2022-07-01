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
  const uri = getMongoURI();

  return connect(uri);
}

function getMongoURI(): string {
  const username = process.env.MONGO_USERNAME;
  const password = encodeURIComponent(process.env.MONGO_PASSWORD);
  const cluster = process.env.MONGO_CLUSTER;

  if (process.env.STAGE === 'development') {
    return `mongodb+srv://${username}:${password}@${cluster}.x82dl.mongodb.net/piggy_chat?retryWrites=true&w=majority`;
  }

  return 'mongodb://127.0.0.1:27017/piggy_chat';
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
