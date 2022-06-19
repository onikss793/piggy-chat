import { Inject, Injectable } from '@nestjs/common';
import type { ObjectId } from 'mongoose';
import { isNil, when } from 'ramda';
import { AlertDAO } from '../../dao';
import { AlertActionType, ISendBirdHandler } from '../../external/send-bird';
import { IAlert } from '../../model';
import { Symbols } from '../../symbols';

interface IMessageSend {
  actionType: AlertActionType;
  parentUserId: string;
  parentMessageId: number;
  targetUserId: string;
  groupChannelUrl: string;
  messageId: number;
  ts: number;
}

@Injectable()
export class AlertService {
  constructor(@Inject(Symbols.ISendBirdHandler) private readonly sendbirdHandler: ISendBirdHandler) {}

  async messageSend({
    actionType,
    parentUserId,
    targetUserId,
    groupChannelUrl,
    messageId,
    parentMessageId,
    ts,
  }: IMessageSend) {
    //  TODO
    // 멘션 시 알림
    // - ***님이 답글을 남겼습니다 : 원문

    const alertToTargetUser = async () => {
      const data: IAlert = {
        alertTo: <unknown>targetUserId as ObjectId,
        action: actionType,
        from: <unknown>parentUserId as ObjectId,
        to: <unknown>targetUserId as ObjectId,
        groupChannelUrl,
        messageId,
        isViewed: false,
      };
      await AlertDAO.saveAlert(data);
    };

    const alertUsersInThread = async () => {
      const { messages: threadedMessages } = await this.sendbirdHandler.getThreadedMessages(parentMessageId, ts, groupChannelUrl);
      const usersInThread = threadedMessages
        .map(msg => msg.user.user_id)
        .map(userId => {
          return {
            alertTo: <unknown>userId as ObjectId,
            action: actionType,
            from: <unknown>parentUserId as ObjectId,
            to: <unknown>targetUserId as ObjectId,
            groupChannelUrl,
            messageId,
            isViewed: false,
          };
        });
      await AlertDAO.saveAlerts(usersInThread);
    };
    const saveAlertsInThread = when(
      (parentMessageId: number) => !isNil(parentMessageId),
      alertUsersInThread,
    );

    await Promise.all([alertToTargetUser, saveAlertsInThread]);
  }

  reactionAdd() {
    return;
  }

  userMentioned() {
    return;
  }

  bestChatUpdated() {
    return;
  }

  hotKeywordUpdated() {
    return;
  }
}
