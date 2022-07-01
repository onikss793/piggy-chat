import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import type { ObjectId } from 'mongoose';
import { ReactionStatisticDAO, UserReactionDAO } from '../../dao';
import type { ISendBirdHandler } from '../../external';
import type { IReactionStatistics, IUserReaction, ReactionType } from '../../model';
import { Symbols } from '../../symbols';
import type { AddReactionResponse, BestChatResponse } from './interface';

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

  async addReaction(userId: ObjectId, messageId: number, reactionType: ReactionType, groupChannelId: string): Promise<AddReactionResponse> {
    const userReaction = await UserReactionDAO.addReaction(userId, messageId, reactionType, groupChannelId);
    await ReactionStatisticDAO.upsertReactionStats(groupChannelId, messageId, reactionType);
    return this.createAddReactionResponse(userReaction);
  }

  async deleteReaction(userId: ObjectId, messageId: number, reactionType: ReactionType, groupChannelId: string): Promise<void> {
    const userReaction = await UserReactionDAO.deleteReaction(userId, messageId, reactionType, groupChannelId);
    await ReactionStatisticDAO.decreaseReactionStats(groupChannelId, messageId, reactionType);
    return this.createDeleteReactionResponse(userReaction);
  }

  private createAddReactionResponse = (userReaction: IUserReaction): AddReactionResponse => {
    return {
      userId: String(userReaction.user),
      reactions: userReaction.reactions.map(r => ({ messageId: r.messageId, reactionType: r.reactionType })),
    };
  };

  private createBestChatResponse = (reactionStats: IReactionStatistics): BestChatResponse => {
    return {
      messageId: reactionStats.messageId,
      likeCount: reactionStats.totalCount,
      groupChannelId: reactionStats.groupChannelId,
    };
  };

  private createDeleteReactionResponse = (userReaction: IUserReaction): void => {
    console.log(JSON.stringify(userReaction));
  };
}
