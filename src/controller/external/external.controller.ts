import { Controller, Inject, Post, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { ObjectId } from 'mongoose';
import type { IMessageWebhook, ISendBirdHandler } from '../../external/send-bird';
import { AlertActionType, IReactionWebhook, WebhookCategory, WebhookResponse } from '../../external/send-bird';
import { ReactionType } from '../../model';
import { AlertService } from '../../service/alert';
import { ReactionService } from '../../service/reaction';
import { Symbols } from '../../symbols';

@Controller('/external')
export class ExternalController {
  constructor(
    @Inject(Symbols.ISendBirdHandler) private readonly sendBirdHandler: ISendBirdHandler,
    private readonly reactionService: ReactionService,
    private readonly alertService: AlertService,
  ) {}

  // 센드버드 윕훅을 처리하는 API
  @Post('/send-bird')
  async handleSendBirdWebhook(@Req() req: Request) {
    const signature = req.get('x-sendbird-signature');
    const verified = this.sendBirdHandler.verifyWebhook(req.body, signature);

    if (!verified) {
      console.error(signature, req.body);
      return new UnauthorizedException('send-bird not verified');
    }

    const category = this.sendBirdHandler.classifyWebhook(req.body.category as string);

    await this.handleData(category, req.body as WebhookResponse);
  }

  private handleData(category: WebhookCategory, data: WebhookResponse) {
    switch (category) {
      case WebhookCategory.REACTION_ADD: {
        const { user, message, channel } = data as IReactionWebhook;

        return this.reactionService.addReaction(
          <unknown>(user.user_id) as ObjectId,
          message.message_id,
          ReactionType.LIKE,
          channel.channel_url,
        );
      }

      case WebhookCategory.REACTION_DELETE: {
        const { user, message, channel } = data as IReactionWebhook;

        return this.reactionService.deleteReaction(
          <unknown>user.user_id as ObjectId,
          message.message_id,
          ReactionType.LIKE,
          channel.channel_url,
        );
      }

      case WebhookCategory.MESSAGE_SEND: {
        const { sender, payload, channel } = data as IMessageWebhook;
        const { parentUserId: targetUserId, parentMessageId } = this.sendBirdHandler.parseCustomData(payload.data);

        return this.alertService.messageSend({
          actionType: AlertActionType.REPLY,
          parentUserId: sender.user_id,
          parentMessageId,
          targetUserId,
          groupChannelUrl: channel.channel_url,
          messageId: payload.message_id,
          ts: payload.created_at
        });
      }
    }
  }
}
