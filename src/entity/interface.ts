export interface IEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IUser extends IEntity {
  account: string;
  oauthKind: string;
  nickname: string;
  phoneNumber?: string;
  verified: boolean;
  userGroupChannel?: IGroupChannel[];
  /*
   kakaoAccount: 'kakao@kakao.com', nickname: 'test'
   */
}

export enum OauthKind {
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
}

export interface IGroupChannel extends IEntity {
  channelUrl: string;
}

export interface IScrap extends IEntity {
  userId: string;
  groupChannelId: string;
  messageId: string;
}

export interface IAlert extends IEntity {
  action: string;
  userId: string;
  groupChannelId: string;
  messageId: string;
  isViewed: boolean;
}

export interface IUserGroupChannel extends IEntity {
  userId: string;
  groupChannelId: string;
}

export interface IBestChat extends IEntity {
  groupChannelId: string;
  messageId: string;
  likeCount: number;
}

export interface IHotKeyword extends IEntity {
  groupChannelId: string;
  words: string[];
  from: Date;
  to: Date;
}
