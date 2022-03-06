import * as dayjs from 'dayjs';
import { connectToMongoDB, mongoModels } from '../../mongo';
import { hotKeywordSetup, hotKeywordTeardown } from '../../test-utils';
import { HotKeywordService } from './hot-keyword.service';

let mongoose: typeof import('mongoose');

beforeAll(async () => {
  mongoose = await connectToMongoDB();
});
afterAll(async () => {
  await mongoose?.connection.close();
});

describe('HotKeywordService', () => {
  const hotKeywordService = new HotKeywordService();

  test('createHotKeywords() should save hot keywords', async () => {
    await hotKeywordTeardown();

    const data = {
      groupChannelUrl: 'GROUP_CHANNEL_URL',
      words: ['HELLO', 'WORLD', 'FOO', 'BAR', 'BAZ'],
    };
    const hotKeywords = await hotKeywordService.createHotKeywords(data);
    const savedHotKeywords = await mongoModels.HotKeyword.find();

    expect(hotKeywords).toEqual(expect.objectContaining({
      groupChannelUrl: data.groupChannelUrl,
      words: data.words,
      from: dayjs().startOf('day').toISOString(),
      to: dayjs().endOf('day').toISOString()
    }));

    expect(savedHotKeywords.length).toBe(1);
    expect(savedHotKeywords[0]).toEqual(expect.objectContaining({
      groupChannelUrl: data.groupChannelUrl,
      words: data.words,
      from: dayjs().startOf('day').toDate(),
      to: dayjs().endOf('day').toDate(),
    }));
  });

  describe('getHotKeywords()', () => {
    test('getHotKeywords() should return from ~ to hot keywords', async () => {
      await hotKeywordSetup();

      const todayHotKeywords = await hotKeywordService.getHotKeywords();

      const today = dayjs();
      const from = today.startOf('day').toISOString();
      const to = today.endOf('day').toISOString();

      expect(todayHotKeywords.length).toBe(1);
      expect(todayHotKeywords[0]).toEqual({
        groupChannelUrl: 'GROUP_CHANNEL_URL',
        words: ['HELLO', 'WORLD', 'FOO', 'BAR', 'BAZ'],
        from,
        to
      });
    });

    test('getHotKeywords() should return exact from ~ to hot keywords', async () => {
      await hotKeywordSetup();

      const tomorrow = dayjs().add(1, 'day');
      const fromTomorrow = tomorrow.startOf('day').toDate();
      const toTomorrow = tomorrow.endOf('day').toDate();
      const tomorrowHotKeywords = await hotKeywordService.getHotKeywords(fromTomorrow, toTomorrow);

      const yesterday = dayjs().add(1, 'day');
      const fromYesterday = yesterday.startOf('day').toDate();
      const toYesterday = yesterday.endOf('day').toDate();
      const yesterdayHotKeywords = await hotKeywordService.getHotKeywords(fromYesterday, toYesterday);

      expect(tomorrowHotKeywords.length).toBe(0);
      expect(yesterdayHotKeywords.length).toBe(0);
    });
  });
});
