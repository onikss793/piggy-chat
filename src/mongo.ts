import { connect, Model } from 'mongoose';
import {
  AlertModel,
  BestChatModel,
  HotKeywordModel,
  IAlert,
  IBestChat,
  IHotKeyword,
  IScrap,
  IUser,
  ScrapModel,
  UserModel,
} from './model';

export const models: IMongoModels = MongoModels();

export interface IMongoModels {
  Alert: Model<IAlert>;
  BestChat: Model<IBestChat>;
  HotKeyword: Model<IHotKeyword>;
  Scrap: Model<IScrap>;
  User: Model<IUser>;
}

export function MongoModels(): IMongoModels {
  // if (!models) {
  //   models = {
  //     Alert: AlertModel(),
  //     BestChat: BestChatModel(),
  //     HotKeyword: HotKeywordModel(),
  //     Scrap: ScrapModel(),
  //     User: UserModel(),
  //   };
  // }
  return {
    Alert: AlertModel(),
    BestChat: BestChatModel(),
    HotKeyword: HotKeywordModel(),
    Scrap: ScrapModel(),
    User: UserModel(),
  };
}

export async function connectToMongoDB(): Promise<typeof import('mongoose')> {
  const mongoDB = await connect(process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/piggy_chat');
  MongoModels();
  return mongoDB;
}
