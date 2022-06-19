import { Controller, Get } from '@nestjs/common';
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
}
