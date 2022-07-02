import { AlertActionType, User } from '../../external';

export interface IMessageSend {
  actionType: AlertActionType;
  parentUserId: string;
  parentMessageId: number;
  senderId: string;
  groupChannelUrl: string;
  messageId: number;
  ts: number;
  mentionedUsers: User[];
}
