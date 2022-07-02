import { cloneDeep } from 'lodash';
import { alertTeardown, userTeardown } from '../../../test-utils';
import { MockSendBirdHandler, ThreadedMessageResponse } from '../../external';
import { connectToMongoDB, models } from '../../mongo';
import { alertToParentUser, alertUsersInThread } from './functions';
import type { IMessageSend } from './interface';

let mongoose: typeof import('mongoose');

beforeAll(async () => {
  mongoose = await connectToMongoDB();
});
afterAll(async () => {
  await mongoose?.connection.close();
});

describe('AlertService', () => {
  const sendbirdHandler = new MockSendBirdHandler();

  test('alertToParentUser', async () => {
    await alertTeardown();
    await userTeardown();

    const { User, Alert } = models;
    const parentUser = await User.create({
      account: 'parentUserAccount',
      oauthKind: 'KAKAO',
      nickname: 'parentNickname',
    });
    const sender = await User.create({
      account: 'targetUserAccount',
      oauthKind: 'KAKAO',
      nickname: 'targetNickname',
    });

    await parentUser.save();
    await sender.save();

    const data: Partial<IMessageSend> = {
      actionType: 'REPLY',
      parentUserId: parentUser.id,
      senderId: sender.id,
      groupChannelUrl: 'groupChannelUrl',
      messageId: 1,
    };
    await alertToParentUser(data);

    const alert = await Alert.findOne({ alertTo: parentUser.id });

    expect(alert.alertTo.toString()).toEqual(parentUser.id);
    expect(alert.action).toEqual(data.actionType);
    expect(alert.from.toString()).toEqual(sender.id);
    expect(alert.to.toString()).toEqual(parentUser.id);
    expect(alert.groupChannelUrl).toEqual(data.groupChannelUrl);
    expect(alert.messageId).toEqual(data.messageId);
  });

  test('alertUsersInThread', async () => {
    await alertTeardown();
    await userTeardown();

    const { User, Alert } = models;
    const parentUser = await User.create({
      account: 'parentUserAccount',
      oauthKind: 'KAKAO',
      nickname: 'parentNickname',
    });
    const sender = await User.create({
      account: 'targetUserAccount',
      oauthKind: 'KAKAO',
      nickname: 'targetNickname',
    });
    const userInThread = await User.create({
      account: 'userInThread',
      oauthKind: 'APPLE',
      nickname: 'userInThread',
    });

    await parentUser.save();
    await sender.save();
    await userInThread.save();

    const data: Omit<IMessageSend, 'mentionedUsers'> = {
      actionType: 'REPLY',
      parentUserId: parentUser.id,
      senderId: sender.id,
      groupChannelUrl: 'groupChannelUrl',
      messageId: 1,
      parentMessageId: 101,
      ts: new Date().getTime(),
    };

    jest
      .spyOn(sendbirdHandler, 'getThreadedMessages')
      .mockImplementation((parentMessageId: number, ts: number, groupChannelUrl: string) => {
        const mock: Pick<ThreadedMessageResponse, 'messages'> = {
          messages: [{
            message_id: 1,
            type: 'MESG',
            is_silent: false,
            custom_type: '',
            channel_url: groupChannelUrl,
            user: {
              user_id: userInThread.id,
              nickname: '',
              profile_url: '',
              metadata: {},
            },
            mention_type: 'users',
            mentioned_users: [],
            is_removed: false,
            message: '쓰레드에 안에 달린 테스트 메시지 입니다.',
            translations: null,
            data: '',
            created_at: null,
            updated_at: null,
            file: null,
            message_survival_seconds: null,
          }],
        };
        return Promise.resolve(cloneDeep(mock));
      });

    await alertUsersInThread(data, sendbirdHandler);

    const alerts = await Alert.find();
    const [alert] = alerts;

    console.log(alerts);
    expect(alerts.length).toBe(1);
    expect(alert.alertTo.toString()).toEqual(userInThread.id);
    expect(alert.from.toString()).toEqual(sender.id);
    expect(alert.to.toString()).toEqual(parentUser.id);
    expect(alert.groupChannelUrl).toEqual(data.groupChannelUrl);
    expect(alert.messageId).toEqual(data.messageId);
    expect(alert.isViewed).toEqual(false);
  });
});
