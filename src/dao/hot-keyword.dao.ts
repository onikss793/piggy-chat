import { IHotKeyword } from '../model';
import { models } from '../mongo';

const { HotKeyword } = models;

export const createHotKeyword = async (hotKeyword: IHotKeyword): Promise<IHotKeyword> => {
  return (await HotKeyword.create(hotKeyword)).save();
};

export const getHotKeywordsFromTo = async (from: Date, to: Date): Promise<IHotKeyword[]> => {
  return HotKeyword.find({
    $or: [
      { from: { $lte: from }, to: { $gte: from } },
      { from: { $lte: to }, to: { $gte: to } },
    ]
  });
};
