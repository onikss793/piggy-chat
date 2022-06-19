import { Controller, Get, Req } from '@nestjs/common';

@Controller('/alert')
export class AlertController {
  constructor() {}

  @Get('/')
  async getMyAlert(@Req() req: Request) {
    const userId = req['userId'];
    console.log(userId);
  }
}
