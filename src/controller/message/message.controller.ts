import { Controller, Get } from '@nestjs/common';

@Controller('/message')
export class MessageController {
  @Get('/')
  public async getBestChat(groupChannelUrls: string[]) {
    return;
  }
}
