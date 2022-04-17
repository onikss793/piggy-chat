import { ObjectId } from 'mongoose';

export interface IBaseEntity {
  id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ISession extends IBaseEntity {
  userId: ObjectId;
  sessionId: string;
}

export interface IUser extends IBaseEntity {
  account: string;
  oauthKind: OauthKind;
  nickname: string;
  phoneNumber?: string;
  verified: boolean;
  currentUserGroupChannelUrl?: string;
}

export enum OauthKind {
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
}

export interface IScrap extends IBaseEntity {
  user: ObjectId | IUser;
  groupChannelId?: string;
  messageId: number;
  groupChannelUrl: string;
}

export interface IAlert extends IBaseEntity {
  action: string;
  user: ObjectId | IUser;
  groupChannelUrl: string;
  messageId: number;
  isViewed: boolean;
}

export type ReactionType = 'LIKE';

export interface IUserReaction extends IBaseEntity {
  user: ObjectId | IUser;
  reactions: { groupChannelId: string, messageId: number, reactionType: ReactionType }[];
}

export interface IReactionStatistics extends IBaseEntity {
  groupChannelId: string;
  messageId: number;
  reactionType: ReactionType;
  totalCount: number;
}

export interface IHotKeyword extends IBaseEntity {
  groupChannelUrl: string;
  words: string[];
  from: Date;
  to: Date;
}
