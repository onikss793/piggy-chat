import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ReactionType } from '../../model';
import { ReactionService } from '../../service/reaction';

@Controller('/message')
export class MessageController {
  constructor(private readonly reactionService: ReactionService) {
  }
  // 채팅방에서 가장 많은 좋아요를 받은 채팅
  @Get('/best')
  async getBestChat() {
    return;
  }

  // 리액션 추가
  @Post('/reaction')
  async addReaction(@Req() req: Request, @Body() body: { messageId: string, reactionType: ReactionType }) {
    const userId = req['userId'];
    return this.reactionService.addReaction(userId, body.messageId, body.reactionType);
  }

  // 리액션 제거
  @Delete('/reaction')
  async removeReaction(@Req() req: Request, @Body() body: { messageId: string, reactionType: ReactionType }) {
    const userId = req['userId'];
    return this.reactionService.deleteReaction(userId, body.messageId, body.reactionType);
  }
}
