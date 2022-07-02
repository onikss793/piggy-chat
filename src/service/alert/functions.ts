import type { ObjectId } from 'mongoose';
import { AlertDAO } from '../../dao';
import type { ISendBirdHandler } from '../../external';
import type { IAlert } from '../../model';
import type { IMessageSend } from './interface';

export const alertToParentUser = ({
  actionType,
  parentUserId,
  senderId,
  groupChannelUrl,
  messageId,
}: Partial<IMessageSend>) => {
  // alert 는 그냥 document 에 박아버리는 것 고민
  const data: IAlert = {
    alertTo: <unknown>parentUserId as ObjectId,
    action: actionType,
    from: <unknown>senderId as ObjectId,
    to: <unknown>parentUserId as ObjectId,
    groupChannelUrl,
    messageId,
    isViewed: false,
  };

  return AlertDAO.saveAlert(data);
};

export const alertUsersInThread = async (
  {
    actionType,
    parentUserId,
    senderId,
    groupChannelUrl,
    messageId,
    parentMessageId,
    ts,
  }: Omit<IMessageSend, 'mentionedUsers'>,
  sendbirdHandler: ISendBirdHandler,
) => {
  const { messages: threadedMessages } = await sendbirdHandler.getThreadedMessages(parentMessageId, ts, groupChannelUrl);
  const data = threadedMessages
    .map(msg => msg.user.user_id)
    .map(userId => {
      return {
        alertTo: <unknown>userId as ObjectId,
        action: actionType,
        from: <unknown>senderId as ObjectId,
        to: <unknown>parentUserId as ObjectId,
        groupChannelUrl,
        messageId,
        isViewed: false,
      };
    });
  return AlertDAO.saveAlerts(data);
};

export const alertToMentionedUsers = (messageSend: IMessageSend) => {
  const data = messageSend.mentionedUsers.map<IAlert>(user => {
    return {
      alertTo: <unknown>user.user_id as ObjectId,
      action: messageSend.actionType,
      from: <unknown>messageSend.senderId as ObjectId,
      to: <unknown>messageSend.parentUserId as ObjectId,
      groupChannelUrl: messageSend.groupChannelUrl,
      messageId: messageSend.messageId,
      isViewed: false,
    };
  });
  return AlertDAO.saveAlerts(data);
};
