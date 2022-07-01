import { ObjectId } from 'mongoose';

export type UserResponse = {
  id: ObjectId;
  nickname: string;
}
