import { ObjectId } from 'mongoose';

export interface IUserDTO {
  id: ObjectId;
  nickname: string;
}
