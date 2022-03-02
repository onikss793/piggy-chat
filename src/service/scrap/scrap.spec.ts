import { connectToMongoDB, mongoModels } from '../../mongo';
import { scrapTeardown, userSetup } from '../../test-utils';
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
    const scraps = await mongoModels.Scrap.find().populate('user');

    expect(scraps.length).toEqual(1);
    expect(scraps[0]).toEqual(expect.objectContaining({
      user: expect.objectContaining({ id: user.id }),
      groupChannelUrl: scrapData.groupChannelUrl,
      messageId: scrapData.messageId,
    }));
  });
});