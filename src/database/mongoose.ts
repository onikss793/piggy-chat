import { connect, Model } from 'mongoose';
import { IAlert, IBestChat, IGroupChannel, IHotKeyword, IScrap, IUser, IUserGroupChannel } from '../entity';
import {
  AlertModel,
  BestChatModel,
  GroupChannelModel,
  HotKeywordModel,
  ScrapModel,
  UserGroupChannelModel,
  UserModel
} from './model';

export let mongoModels: IMongoModels;

export interface IMongoModels {
  Alert: Model<IAlert>;
  BestChat: Model<IBestChat>;
  GroupChannel: Model<IGroupChannel>;
  HotKeyword: Model<IHotKeyword>;
  Scrap: Model<IScrap>;
  User: Model<IUser>;
  UserGroupChannel: Model<IUserGroupChannel>;
}

export function getMongoModels(): IMongoModels {
  return {
    Alert: AlertModel(),
    BestChat: BestChatModel(),
    GroupChannel: GroupChannelModel(),
    HotKeyword: HotKeywordModel(),
    Scrap: ScrapModel(),
    User: UserModel(),
    UserGroupChannel: UserGroupChannelModel(),
  };
}

export async function connectToMongoDB(): Promise<typeof import('mongoose')> {
  const mongoDB = await connect('mongodb://127.0.0.1:27017/piggy_chat');
  mongoModels = getMongoModels();
  return mongoDB;
}
