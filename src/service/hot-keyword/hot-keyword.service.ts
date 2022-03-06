import { Injectable } from '@nestjs/common';
import { HotKeywordDAO } from '../../dao';
import { IHotKeyword } from '../../model';
import { ICreateHotKeywordDTO, IHotKeywordDTO } from './interface';

@Injectable()
export class HotKeywordService {
  async createHotKeywords(data: ICreateHotKeywordDTO) {
    const hotKeywordData: IHotKeyword = {
      groupChannelUrl: data.groupChannelUrl,
      words: data.words,
      from: data.from,
      to: data.to,
    };
    const hotKeyword = await HotKeywordDAO.createHotKeyword(hotKeywordData);

    return this.createHotKeywordDTO(hotKeyword);
  }

  async getHotKeywords(from = new Date(), to = new Date()): Promise<IHotKeywordDTO[]> {
    return (await HotKeywordDAO.getHotKeywordsFromTo(from, to)).map(hk => this.createHotKeywordDTO(hk));
  }

  private createHotKeywordDTO = (hotKeyword: IHotKeyword): IHotKeywordDTO => ({
    groupChannelUrl: hotKeyword.groupChannelUrl,
    words: hotKeyword.words,
    from: hotKeyword.from.toISOString(),
    to: hotKeyword.to.toISOString(),
  });
}
