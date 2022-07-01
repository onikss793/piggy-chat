import { Inject, Injectable } from '@nestjs/common';
import { isEmpty, isNil } from 'ramda';
import type { ISendBirdHandler } from '../../external';
import { Symbols } from '../../symbols';
import { alertToMentionedUsers, alertToTargetUser, alertUsersInThread } from './functions';
import type { IMessageSend } from './interface';

@Injectable()
export class AlertService {
  constructor(@Inject(Symbols.ISendBirdHandler) private readonly sendbirdHandler: ISendBirdHandler) {}

  /**
   * 메시지 발송 시 알림 처리
   * @returns {Promise<void>}
   * @param data
   */
  async messageSend(data: IMessageSend): Promise<void> {
    const tasks = [];
    const assign = <F>(fun: F) => tasks.push(fun);

    assign(alertToTargetUser({ ...data }));
    !isNil(data.parentMessageId) && assign(alertUsersInThread({ ...data }, this.sendbirdHandler));
    !isEmpty(data.mentionedUsers) && assign(alertToMentionedUsers({ ...data }));

    await Promise.allSettled(tasks);
  }

  // reactionAdd() {
  //   return;
  // }
  //
  // userMentioned() {
  //   return;
  // }
  //
  // bestChatUpdated() {
  //   return;
  // }
  //
  // hotKeywordUpdated() {
  //   return;
  // }
}
