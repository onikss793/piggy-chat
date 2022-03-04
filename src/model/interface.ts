import { ObjectId } from 'mongoose';

export interface IEntity {
  id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IUser extends IEntity {
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

export interface IScrap extends IEntity {
  user: ObjectId | IUser;
  groupChannelId?: string;
  messageId: string;
  groupChannelUrl: string;
}

export interface IAlert extends IEntity {
  action: string;
  user: ObjectId | IUser;
  groupChannelUrl: string;
  messageId: string;
  isViewed: boolean;
}

export interface IBestChat extends IEntity {
  groupChannelUrl: string;
  messageId: string;
  likeCount: number;
}

export interface IHotKeyword extends IEntity {
  groupChannelUrl: string;
  words: string[];
  from: Date;
  to: Date;
}
