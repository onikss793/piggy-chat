import { IScrap } from '../model';
import { mongoModels } from '../mongo';

export const saveScrap = async (scrap: IScrap): Promise<IScrap> => {
  return (await mongoModels.Scrap.create(scrap)).save();
};
