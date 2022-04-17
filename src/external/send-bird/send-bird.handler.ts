import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IMessageListResponse, IMessageResponse, ISendBirdHandler } from './interface';

@Injectable()
export class SendBirdHandler implements ISendBirdHandler {
  private readonly applicationId: string;

  constructor() {
    this.applicationId = process.env.SEND_BIRD_APP_ID;
  }

  async getMessageList(channelUrl: string, messageTs: number, channelType = 'group_channels'): Promise<IMessageListResponse> {
    try {
      const url = `https://api-${this.applicationId}.sendbird.com/v3/${channelType}/${channelUrl}/messages`;
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
}

export class MockSendBirdHandler implements ISendBirdHandler {

  getMessageList(): Promise<IMessageListResponse> {
    const mock: IMessageResponse = {
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
}
