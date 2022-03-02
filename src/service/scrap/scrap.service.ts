import { Injectable } from '@nestjs/common';
import { ScrapDAO } from '../../dao';
import { IScrap } from '../../model';
import { IScrapDataDTO } from './interface';

@Injectable()
export class ScrapService {
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
}
