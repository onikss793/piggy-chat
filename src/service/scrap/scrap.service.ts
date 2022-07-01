import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ScrapDAO } from '../../dao';
import type { IScrap, IUser } from '../../model';
import type { IScrapDataDTO, ScrapResponse } from './interface';

@Injectable()
export class ScrapService {
  async getScraps(userId: ObjectId) {
    return (await ScrapDAO.getUserScrap(userId)).map(scrap => this.createScrapResponse(scrap));
  }

  async scrap(scrapDataDTO: IScrapDataDTO): Promise<void> {
    const scrap = this.createScrapData(scrapDataDTO);
    await ScrapDAO.saveScrap(scrap);
  }

  private createScrapData = (data: IScrapDataDTO): IScrap => {
    return {
      user: data.userId,
      groupChannelId: data.groupChannelId,
      messageId: data.messageId,
      groupChannelUrl: data.groupChannelUrl,
    };
  };

  private createScrapResponse = (scrap: IScrap): ScrapResponse => ({
    user: {
      id: (<IUser>scrap.user).id,
      nickname: (<IUser>scrap.user).nickname,
    },
    groupChannelUrl: scrap.groupChannelUrl,
    messageId: scrap.messageId,
  });
}
