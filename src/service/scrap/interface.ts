import { ObjectId } from 'mongoose';
import { UserResponse } from '../user';

export interface IScrapDataDTO {
  userId: ObjectId;
  groupChannelId?: string;
  groupChannelUrl: string;
  messageId: number;
}

export interface ScrapResponse {
  user: ObjectId | UserResponse;
  groupChannelUrl: string;
  messageId: number;
}
