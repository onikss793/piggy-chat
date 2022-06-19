import { BinaryLike } from 'crypto';
import { ReactionType } from '../../model';

export interface ISendBirdHandler {
  getMessageList(channelUrl: string, messageTs: number, channelType?: string): Promise<IMessageListResponse>;
  getThreadedMessages(
    parentMessageId: number,
    messageTs: number,
    channelUrl: string,
    channelType?: string,
  ): Promise<IThreadedMessageResponse>;
  verifyWebhook(body: BinaryLike, signature: string): boolean;
  classifyWebhook(category: string): WebhookCategory;
  parseCustomData(data: string): ICustomData;
}

export interface ICustomData {
  parentUserId: string;
  parentMessageId: number;
}

export enum WebhookCategory {
  REACTION_ADD = 'REACTION_ADD',
  REACTION_DELETE = 'REACTION_DELETE',
  MESSAGE_SEND = 'MESSAGE_SEND',
}

export type WebhookResponse = IReactionWebhook | IMessageWebhook;

export interface IMessageListResponse {
  messages: IMessage[];
}

export interface IMessage {
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

export interface IReactionWebhook {
  category: WebhookCategory;
  reaction: ReactionType;
  app_id: string;
  ts: number;
  user: {
    user_id: string;
    nickname: string;
    profile_url: string;
  },
  message: {
    sender_id: string;
    message_id: string;
  },
  channel: {
    is_distinct: boolean;
    name: string;
    custom_type: string;
    is_ephemeral: boolean;
    channel_url: string;
    is_public: boolean;
    is_discoverable: boolean;
    is_super: boolean;
    data: string;
  }
}

export interface IMessageWebhook {
  category: string;
  sender: {
    user_id: string;
    nickname: string;
    profile_url: string;
    metadata: Record<string, unknown>;
  },
  silent: boolean,
  sender_ip_addr: string;
  custom_type: string;
  mention_type: string;
  mentioned_users: [];
  members: {
    user_id: string;
    nickname: string;
    profile_url: string;
    is_active: boolean;
    is_online: boolean;
    is_hidden: number;
    state: 'joined' | 'invited';
    is_blocking_sender: boolean;
    is_blocked_by_sender: boolean;
    unread_message_count: number;
    total_unread_message_count: number;
    channel_unread_message_count: number;
    channel_mention_count: number;
    push_enabled: boolean;
    push_trigger_option: string; // "default"
    do_not_disturb: boolean;
    metadata: Record<string, unknown>;
  }[];
  type: 'MESG';
  payload: {
    message_id: number;
    custom_type: string;
    message: string;
    translations: {
      en: string;
      de: string;
    };
    created_at: number;
    data: string;
  };
  channel: {
    name: string;
    channel_url: string;
    custom_type: string;
    is_distinct: boolean;
    is_public: boolean;
    is_super: boolean;
    is_ephemeral: boolean;
    is_discoverable: boolean;
    data: string;
  };
  sdk: string;
  app_id: string;
}

export interface IThreadedMessageResponse {
  messages: {
    message_id: number;
    type: 'MESG';
    is_silent: boolean;
    custom_type: string;
    channel_url: string;
    user: {
      user_id: string;
      nickname: string;
      profile_url: string;
      metadata: Record<string, unknown>;
    };
    mention_type: 'users';
    mentioned_users: [];
    is_removed: boolean;
    message: string;
    translations: Record<string, unknown>;
    data: string;
    created_at: number;
    updated_at: number;
    file: Record<string, unknown>;
    message_survival_seconds: number;
  }[];
}

export enum AlertActionType {
  REPLY = 'REPLY',
}
