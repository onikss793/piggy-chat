export interface ICreateHotKeywordDTO {
  groupChannelUrl: string;
  words: string[];
  from?: Date;
  to?: Date;
}

export interface IHotKeywordDTO {
  groupChannelUrl: string;
  words: string[];
  from: string;
  to: string;
}
