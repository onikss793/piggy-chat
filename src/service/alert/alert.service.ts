import { Inject, Injectable } from '@nestjs/common';
import type { ISendBirdHandler } from '../../external';
import { Symbols } from '../../symbols';
import { IMessageSend } from './interface';

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

    // cond<IMessageSend>([
    //   [() => !isNil(parentMessageId), alertUsersInThread({
    //     actionType,
    //     parentMessageId,
    //     targetUserId,
    //     parentUserId,
    //     groupChannelUrl,
    //     messageId,
    //   }, this.sendbirdHandler)],
    // ]);
    //
    // const saveAlertsInThread = when(
    //   (data: IMessageSend) => !isNil(data.parentMessageId),
    //   alertUsersInThread,
    //   ({ actionType, parentMessageId, targetUserId, parentUserId, groupChannelUrl, messageId }, this.sendbirdHandler)
    // );

    // await Promise.all([alertToTargetUser, saveAlertsInThread]);
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
