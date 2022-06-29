import type { ObjectId } from 'mongoose';
import { AlertDAO } from '../../dao';
import { ISendBirdHandler } from '../../external';
import type { IAlert } from '../../model';
import type { IMessageSend } from './interface';

export const alertToTargetUser = async ({
  actionType,
  parentUserId,
  targetUserId,
  groupChannelUrl,
  messageId,
}: IMessageSend) => {
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

export const alertUsersInThread = async (
  {
    actionType,
    parentUserId,
    targetUserId,
    groupChannelUrl,
    messageId,
    parentMessageId,
    ts
  }: IMessageSend,
  sendbirdHandler: ISendBirdHandler,
): Promise<void> => {
  const { messages: threadedMessages } = await sendbirdHandler.getThreadedMessages(parentMessageId, ts, groupChannelUrl);
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
