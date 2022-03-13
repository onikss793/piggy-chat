import { scrapSetup, scrapTeardown, userSetup } from '../../../test-utils';
import { connectToMongoDB, models } from '../../mongo';
import { IScrapDataDTO } from './interface';
import { ScrapService } from './scrap.service';

let mongoose: typeof import('mongoose');

beforeAll(async () => {
  mongoose = await connectToMongoDB();
});
afterAll(async () => {
  await mongoose?.connection.close();
});

describe('ScrapService', () => {
  const scrapService = new ScrapService();

  test('scrap() should save scraps', async () => {
    await scrapTeardown();
    const user = await userSetup();

    const scrapData: IScrapDataDTO = {
      userId: user.id,
      groupChannelUrl: 'GROUP_CHANNEL_URL',
      messageId: 'MESSAGE_ID',
    };
    await scrapService.scrap(scrapData);
    const scraps = await models.Scrap.find().populate('user');

    expect(scraps.length).toEqual(1);
    expect(scraps[0]).toEqual(expect.objectContaining({
      user: expect.objectContaining({ id: user.id }),
      groupChannelUrl: scrapData.groupChannelUrl,
      messageId: scrapData.messageId,
    }));
  });

  test('getScraps() should return user\'s scraps', async () => {
    const user = await userSetup();
    const setupScrap = await scrapSetup(user.id);

    const scraps = await scrapService.getScraps(user.id);

    expect(scraps.length).toEqual(1);
    expect(scraps[0]).toEqual({
      user: {
        id: setupScrap.user.toString(),
        nickname: user.nickname,
      },
      groupChannelUrl: setupScrap.groupChannelUrl,
      messageId: setupScrap.messageId,
    });
  });
});
