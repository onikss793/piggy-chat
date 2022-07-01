export interface ICreateHotKeywordDTO {
  groupChannelUrl: string;
  words: string[];
  from?: Date;
  to?: Date;
}

export type HotKeywordResponse = {
  groupChannelUrl: string;
  words: string[];
  from: string;
  to: string;
}
