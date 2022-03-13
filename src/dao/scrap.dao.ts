import { ObjectId } from 'mongoose';
import { IScrap } from '../model';
import { models } from '../mongo';

const { Scrap } = models;

export const getUserScrap = async (userId: ObjectId): Promise<IScrap[]> => {
  return Scrap.find({ user: userId }).populate('user');
};

export const saveScrap = async (scrap: IScrap): Promise<IScrap> => {
  return (await Scrap.create(scrap)).save();
};
