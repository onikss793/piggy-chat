import type { ReactionType } from '../../model';

export type AddReactionResponse = {
  userId: string;
  reactions: {
    messageId: number,
    reactionType: ReactionType
  }[];
}

export type BestChatResponse = {
  messageId: number;
  likeCount: number;
  groupChannelId: string;
}
