import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { BinaryLike, createHmac } from 'crypto';
import type { ICustomData, IMessage, IMessageListResponse, ISendBirdHandler } from './interface';
import { IThreadedMessageResponse, WebhookCategory } from './interface';

@Injectable()
export class SendBirdHandler implements ISendBirdHandler {
  private readonly APPLICATION_ID: string;
  private readonly API_TOKEN: string;
  private readonly URL: string;

  constructor() {
    this.APPLICATION_ID = process.env.SEND_BIRD_APP_ID;
    this.API_TOKEN = process.env.SEND_BIRD_API_TOKEN;
    this.URL = `https://api-${this.APPLICATION_ID}.sendbird.com/v3`;
  }

  async getThreadedMessages(
    parentMessageId: number,
    messageTs: number,
    channelUrl: string,
    channelType = 'group_channels',
  ): Promise<IThreadedMessageResponse> {
    try {
      const url = `${this.URL}/${channelType}/${channelUrl}/messages/`;
      const params = {
        parent_message_id: parentMessageId,
        message_ts: messageTs,
      };
      const { data } = await axios.get<IThreadedMessageResponse>(url, { params });
      console.info(JSON.stringify(data) + 'GetThreadedMessages');
      return data;
    } catch (e) {
      console.info(JSON.stringify(e));
    }
  }

  async getMessageList(channelUrl: string, messageTs: number, channelType = 'group_channels'): Promise<IMessageListResponse> {
    try {
      const url = `${this.URL}/${channelType}/${channelUrl}/messages`;
      const { data } = await axios.get<IMessageListResponse>(url, {
        params: {
          message_ts: messageTs,
        },
      });
      console.info(JSON.stringify(data) + 'GetMessageList');
      return data;
    } catch (e) {
      console.info(JSON.stringify(e));
    }
  }

  verifyWebhook(body: BinaryLike, signature: string): boolean {
    const hash = createHmac('sha256', this.API_TOKEN).update(body).digest('hex');
    return signature === hash;
  }

  classifyWebhook(category: string): WebhookCategory {
    switch (category) {
      case 'group_channel:reaction_add':
        return WebhookCategory.REACTION_ADD;
      case 'group_channel:message_send':
        return WebhookCategory.MESSAGE_SEND;
    }
  }

  parseCustomData(data: string): ICustomData {
    return JSON.parse(data) as ICustomData;
  }
}

export class MockSendBirdHandler implements ISendBirdHandler {
  getMessageList(): Promise<IMessageListResponse> {
    const mock: IMessage = {
      message_id: 1,
      type: null,
      custom_type: null,
      channel_url: null,
      user: {
        user_id: null,
        nickname: null,
        profile_url: null,
        metadata: {
          location: null,
          marriage: null,
        },
      },
      mention_type: null,
      mentioned_users: [
        {
          user_id: null,
          nickname: null,
          profile_url: null,
          metadata: {
            location: null,
            marriage: null,
          },
        },
      ],
      is_removed: null,
      message: null,
      translations: null,
      data: null,
      sorted_metaarray: [{
        key: null,
        value: [null],
      }],
      og_tag: {
        'og:url': null,
        'og:title': null,
        'og:description': null,
        'og:image': {
          url: null,
          secure_url: null,
          width: null,
          height: null,
        },
      },
      created_at: null,
      updated_at: null,
      file: null,
    };
    return Promise.resolve({
      messages: [
        { ...mock },
        { ...mock, message_id: 2 },
        { ...mock, message_id: 3 },
      ],
    });
  }
  verifyWebhook(body: BinaryLike, signature: string): boolean {
    return false;
  }
  classifyWebhook(category: string): WebhookCategory {
    return undefined;
  }
  parseCustomData(data: string): ICustomData {
    return undefined;
  }
  getThreadedMessages(parentMessageId: number, messageTs: number, channelUrl: string, channelType?: string): Promise<IThreadedMessageResponse> {
    return Promise.resolve(undefined);
  }

}
