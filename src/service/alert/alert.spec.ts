import { alertTeardown, userTeardown } from '../../../test-utils';
import { connectToMongoDB, models } from '../../mongo';
// import { AlertService } from './alert.service';
import { alertToTargetUser } from './functions';
import type { IMessageSend } from './interface';

let mongoose: typeof import('mongoose');

beforeAll(async () => {
  mongoose = await connectToMongoDB();
});
afterAll(async () => {
  await mongoose?.connection.close();
});

describe('AlertService', () => {
  // const sendbirdHandler = new MockSendBirdHandler();
  // const alertService = new AlertService(sendbirdHandler);

  test('getAlertToTargetUser', async () => {
    await alertTeardown();
    await userTeardown();

    const { User, Alert } = models;
    const parentUser = await User.create({
      account: 'parentUserAccount',
      oauthKind: 'KAKAO',
      nickname: 'parentNickname',
    });
    const targetUser = await User.create({
      account: 'targetUserAccount',
      oauthKind: 'KAKAO',
      nickname: 'targetNickname',
    });

    await parentUser.save();
    await targetUser.save();

    const data: Partial<IMessageSend> = {
      actionType: 'REPLY',
      parentUserId: parentUser.id,
      targetUserId: targetUser.id,
      groupChannelUrl: 'groupChannelUrl',
      messageId: 1,
    };
    await alertToTargetUser(data);

    const alert = await Alert.findOne({ alertTo: targetUser.id });
    expect(alert).toEqual(expect.objectContaining({
      alertTo: targetUser.id,
      action: data.actionType,
      from: parentUser.id,
      to: targetUser.id,
      groupChannelUrl: data.groupChannelUrl,
      messageId: data.messageId,
      isViewed: false,
    }));
  });
});
