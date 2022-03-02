import { Body, Controller, HttpStatus, Post, Req, Request, UseGuards } from '@nestjs/common';
import { IScrapDataDTO, ScrapService } from '../service/scrap';
import { UserGuard } from '../util';

@Controller('/scrap')
export class ScrapController {
  constructor(private readonly scrapService: ScrapService) {}

  @Post('/')
  @UseGuards(UserGuard)
  async scrap(@Req() req: Request, @Body() body: Omit<IScrapDataDTO, 'userId'>): Promise<HttpStatus> {
    const userId = req['userId'];
    await this.scrapService.scrap({ ...body, userId });
    return HttpStatus.OK;
  }
}
