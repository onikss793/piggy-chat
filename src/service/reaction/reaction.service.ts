import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { UserReactionDAO } from '../../dao';
import { IUserReaction, ReactionType } from '../../model';
import { IAddReactionDTO } from './interface';

@Injectable()
export class ReactionService {
  async addReaction(userId: ObjectId, messageId: string, reactionType: ReactionType): Promise<IAddReactionDTO> {
    const userReaction = await UserReactionDAO.addReaction(userId, messageId, reactionType);
    return this.addReactionDTO(userReaction);
  }

  private addReactionDTO = (userReaction: IUserReaction): IAddReactionDTO => {
    return {
      userId: String(userReaction.user),
      reactions: userReaction.reactions.map(r => ({ messageId: r.messageId, reactionType: r.reactionType }))
    };
  };
}
