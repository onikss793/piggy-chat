import { ObjectId } from 'mongoose';
import { IScrap } from '../model';
import { mongoModels } from '../mongo';

export const getUserScrap = async (userId: ObjectId): Promise<IScrap[]> => {
  return mongoModels.Scrap.find({ user: userId }).populate('user');
};

export const saveScrap = async (scrap: IScrap): Promise<IScrap> => {
  return (await mongoModels.Scrap.create(scrap)).save();
};
