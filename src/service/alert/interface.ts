import { AlertActionType, Member } from '../../external';

export interface IMessageSend {
  actionType: AlertActionType;
  parentUserId: string;
  parentMessageId: number;
  targetUserId: string;
  groupChannelUrl: string;
  messageId: number;
  ts: number;
  mentionedUsers: Member[];
}
