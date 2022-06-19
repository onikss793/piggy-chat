import { ReactionType } from '../../model';

export interface IAddReactionDTO {
  userId: string;
  reactions: {
    messageId: number,
    reactionType: ReactionType
  }[];
}

export interface IBestChatDTO {
  messageId: number;
  likeCount: number;
  groupChannelId: string;
}
