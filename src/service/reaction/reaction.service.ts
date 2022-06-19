import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ObjectId } from 'mongoose';
import { ReactionStatisticDAO, UserReactionDAO } from '../../dao';
import { ISendBirdHandler } from '../../external/send-bird';
import { IReactionStatistics, IUserReaction, ReactionType } from '../../model';
import { Symbols } from '../../symbols';
import { IAddReactionDTO, IBestChatDTO } from './interface';

@Injectable()
export class ReactionService {
  constructor(@Inject(Symbols.ISendBirdHandler) private readonly sendBirdHandler: ISendBirdHandler) {}

  async getBestChat() { // 가장 많은 "좋아요"를 받은 채팅
    // 24 시간 내에 가장 많은 좋아요를 받은 채팅
    // TODO
    //  24시간 내에 생성된 message_id 모두 GET
    //  각 메시지의 reactionType === LIKE 인 reaction_statistics GET
    //  totalCount reverse sort 후 first 반환

    const channelUrls = ['channel_url'];
    const aDayAgo = dayjs().subtract(1, 'day');
    const [bestChats] = await Promise.all(channelUrls.map(async channelUrl => {
      const { messages } = await this.sendBirdHandler.getMessageList(channelUrl, aDayAgo.unix());
      const messageIds = messages.flatMap(m => m.message_id);
      const reactionStats = await ReactionStatisticDAO.findReactionStatsByMessageIds(messageIds);

      return reactionStats
        .sort((a, b) => b.totalCount - a.totalCount)
        .slice(0, 3);
    }));

    return bestChats.map(chat => ({
      messageId: chat.messageId,
      likeCount: chat.totalCount,
      groupChannelId: chat.groupChannelId,
    }));
  }

  async addReaction(userId: ObjectId, messageId: string, reactionType: ReactionType, groupChannelId: string): Promise<IAddReactionDTO> {
    const userReaction = await UserReactionDAO.addReaction(userId, messageId, reactionType, groupChannelId);
    await ReactionStatisticDAO.upsertReactionStats(groupChannelId, messageId, reactionType);
    return this.addReactionDTO(userReaction);
  }

  async deleteReaction(userId: ObjectId, messageId: string, reactionType: ReactionType, groupChannelId: string): Promise<void> {
    const userReaction = await UserReactionDAO.deleteReaction(userId, messageId, reactionType, groupChannelId);
    await ReactionStatisticDAO.decreaseReactionStats(groupChannelId, messageId, reactionType);
    return this.deleteReactionDTO(userReaction);
  }

  private addReactionDTO = (userReaction: IUserReaction): IAddReactionDTO => {
    return {
      userId: String(userReaction.user),
      reactions: userReaction.reactions.map(r => ({ messageId: r.messageId, reactionType: r.reactionType })),
    };
  };

  private bestChatDTO = (reactionStats: IReactionStatistics): IBestChatDTO => {
    return {
      messageId: reactionStats.messageId,
      likeCount: reactionStats.totalCount,
      groupChannelId: reactionStats.groupChannelId,
    };
  };

  private deleteReactionDTO = (userReaction: IUserReaction): void => {
    // console.log(JSON.stringify(userReaction));
  };
}
