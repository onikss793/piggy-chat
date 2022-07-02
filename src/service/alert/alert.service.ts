import { Inject, Injectable } from '@nestjs/common';
import { isEmpty, isNil } from 'ramda';
import type { ISendBirdHandler } from '../../external';
import { Symbols } from '../../symbols';
import { alertToMentionedUsers, alertToParentUser, alertUsersInThread } from './functions';
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
    const assign = <F>(fun: F, condition = true) => condition ? tasks.push(fun) : null;

    assign(
      alertToParentUser({ ...data }),
    );
    assign(
      alertUsersInThread({ ...data }, this.sendbirdHandler),
      !isNil(data.parentMessageId),
    );
    assign(
      alertToMentionedUsers({ ...data }),
      !isEmpty(data.mentionedUsers),
    );

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
