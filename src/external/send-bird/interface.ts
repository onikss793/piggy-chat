export interface ISendBirdHandler {
  getMessageList(channelUrl: string, messageTs: number, channelType?: string): Promise<IMessageListResponse>;
}

export interface IMessageListResponse {
  messages: IMessageResponse[];
}

export interface IMessageResponse {
  message_id: number;
  type: string;
  custom_type: string;
  channel_url: string;
  user: {
    user_id: string;
    nickname: string;
    profile_url: string;
    metadata: {
      location: string;
      marriage: string;
    }
  };
  mention_type: string;
  mentioned_users: [
    {
      user_id: string;
      nickname: string;
      profile_url: string;
      metadata: {
        location: string;
        marriage: string;
      }
    },
  ],
  is_removed: boolean;
  message: string;
  translations: unknown;
  data: string;
  sorted_metaarray: {
    key: string;
    value: string[];
  }[];
  og_tag: {
    'og:url': string;
    'og:title': string;
    'og:description': string;
    'og:image': {
      url: string;
      secure_url: string;
      width: number;
      height: number;
    }
  },
  created_at: number;
  updated_at: number;
  file: unknown;
}
