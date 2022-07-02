import type { BinaryLike } from 'crypto';
import type { ReactionType } from '../../model';

export interface ISendBirdHandler {
  getMessageList(channelUrl: string, messageTs: number, channelType?: string): Promise<MessageListResponse>;
  getThreadedMessages(
    parentMessageId: number,
    messageTs: number,
    channelUrl: string,
    channelType?: string,
  ): Promise<ThreadedMessageResponse>;
  verifyWebhook(body: BinaryLike, signature: string): boolean;
  classifyWebhook(category: string): WebhookCategory;
  parseCustomData(data: string): CustomData;
}

export type CustomData = {
  parentUserId: string;
  parentMessageId: number;
}

export type WebhookCategory = keyof typeof WebhookCategoryEnum;

export enum WebhookCategoryEnum {
  REACTION_ADD = 'REACTION_ADD',
  REACTION_DELETE = 'REACTION_DELETE',
  MESSAGE_SEND = 'MESSAGE_SEND',
}

export type WebhookResponse = ReactionWebhook | MessageWebhook;

export type MessageListResponse = {
  messages: Message[];
}

export type Message = {
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

export type ReactionWebhook = {
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
    sender_id: number;
    message_id: number;
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

export type Member = {
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
}

export type User = Pick<Member, 'user_id' | 'nickname' | 'profile_url' | 'metadata'>;

export type MessageWebhook = {
  category: string;
  sender: User, // 메시지를 보낸 사용자
  silent: boolean,
  sender_ip_addr: string;
  custom_type: string;
  mention_type: string;
  mentioned_users: User[]; // 메시지에서 멘션된 사용자
  members: Member[];
  type: 'MESG';
  payload: {
    message_id: number; // 보내진 메시지 ID
    custom_type: string;
    message: string;
    translations: {
      en: string;
      de: string;
    };
    created_at: number;
    data: string; // 쓰레드 안에 있는 메시지라면 부모 사용자 ID 및 메시지 ID
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

export type ThreadedMessageResponse = {
  messages: {
    message_id: number;
    type: string;
    is_silent: boolean;
    custom_type: string;
    channel_url: string;
    user: User;
    mention_type: string;
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

export type AlertActionType = keyof typeof AlertActionTypeEnum;

export enum AlertActionTypeEnum {
  REPLY = 'REPLY',
}
