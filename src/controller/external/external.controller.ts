import { Controller, Inject, Post, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { ObjectId } from 'mongoose';
import type {
  ISendBirdHandler,
  MessageWebhook,
  ReactionWebhook,
  WebhookCategory,
  WebhookResponse,
} from '../../external';
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
      case 'REACTION_ADD': {
        const { user, message, channel } = data as ReactionWebhook;

        return this.reactionService.addReaction(
          <unknown>(user.user_id) as ObjectId,
          message.message_id,
          'LIKE',
          channel.channel_url,
        );
      }

      case 'REACTION_DELETE': {
        const { user, message, channel } = data as ReactionWebhook;

        return this.reactionService.deleteReaction(
          <unknown>user.user_id as ObjectId,
          message.message_id,
          'LIKE',
          channel.channel_url,
        );
      }

      case 'MESSAGE_SEND': {
        const { sender, payload, channel, mentioned_users: mentionedUsers } = data as MessageWebhook;
        const { parentUserId: targetUserId, parentMessageId } = this.sendBirdHandler.parseCustomData(payload.data);

        return this.alertService.messageSend({
          actionType: 'REPLY',
          parentUserId: sender.user_id,
          parentMessageId,
          targetUserId,
          groupChannelUrl: channel.channel_url,
          messageId: payload.message_id,
          ts: payload.created_at,
          mentionedUsers,
        });
      }
    }
  }
}
