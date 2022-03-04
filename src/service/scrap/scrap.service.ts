import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ScrapDAO } from '../../dao';
import { IScrap, IUser } from '../../model';
import { IScrapDataDTO, IScrapDTO } from './interface';

@Injectable()
export class ScrapService {
  async getScraps(userId: ObjectId) {
    return (await ScrapDAO.getUserScrap(userId)).map(scrap => this.createScrapDTO(scrap));
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

  private createScrapDTO = (scrap: IScrap): IScrapDTO => ({
    user: {
      id: (<IUser>scrap.user).id,
      nickname: (<IUser>scrap.user).nickname,
    },
    groupChannelUrl: scrap.groupChannelUrl,
    messageId: scrap.messageId,
  });
}
