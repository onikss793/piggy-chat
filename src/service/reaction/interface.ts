import { ReactionType } from '../../model';

export interface IAddReactionDTO {
  userId: string;
  reactions: {
    messageId: string,
    reactionType: ReactionType
  }[];
}
