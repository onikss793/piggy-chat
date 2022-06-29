import { AlertActionType } from '../../external/send-bird';

export interface IMessageSend {
  actionType: AlertActionType;
  parentUserId: string;
  parentMessageId: number;
  targetUserId: string;
  groupChannelUrl: string;
  messageId: number;
  ts: number;
}
