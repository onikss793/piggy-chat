import { IHotKeyword } from '../model';
import { mongoModels } from '../mongo';

export const createHotKeyword = async (hotKeyword: IHotKeyword): Promise<IHotKeyword> => {
  return (await mongoModels.HotKeyword.create(hotKeyword)).save();
};

export const getHotKeywordsFromTo = async (from: Date, to: Date): Promise<IHotKeyword[]> => {
  // TODO: find all of hk.from <= from <= hk.to or hk.from <= to <= hk.to
  return mongoModels.HotKeyword.find({
    $or: [
      { from: { $lte: from }, to: { $gte: from } },
      { from: { $lte: to }, to: { $gte: to } },
    ]
  });
};
