import { Injectable } from '@nestjs/common';
import { HotKeywordDAO } from '../../dao';
import type { IHotKeyword } from '../../model';
import type { HotKeywordResponse, ICreateHotKeywordDTO } from './interface';

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

    return this.createHotKeywordResponse(hotKeyword);
  }

  async getHotKeywords(from = new Date(), to = new Date()): Promise<HotKeywordResponse[]> {
    return (await HotKeywordDAO.getHotKeywordsFromTo(from, to)).map(hk => this.createHotKeywordResponse(hk));
  }

  private createHotKeywordResponse = (hotKeyword: IHotKeyword): HotKeywordResponse => ({
    groupChannelUrl: hotKeyword.groupChannelUrl,
    words: hotKeyword.words,
    from: hotKeyword.from.toISOString(),
    to: hotKeyword.to.toISOString(),
  });
}
