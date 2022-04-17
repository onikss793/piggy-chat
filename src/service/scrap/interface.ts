import { ObjectId } from 'mongoose';
import { IUserDTO } from '../user';

export interface IScrapDataDTO {
  userId: ObjectId;
  groupChannelId?: string;
  groupChannelUrl: string;
  messageId: number;
}

export interface IScrapDTO {
  user: ObjectId | IUserDTO;
  groupChannelUrl: string;
  messageId: number;
}
