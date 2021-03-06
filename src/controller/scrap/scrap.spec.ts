import axios from 'axios';
import Mongoose from 'mongoose';
import { scrapTeardown, userSetup } from '../../../test-utils';
import { connectToMongoDB } from '../../mongo';

let mongoose: typeof Mongoose;

beforeAll(async () => {
  mongoose = await connectToMongoDB();
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Scrap Controller Test', () => {
  test('scrap() should save new scrap', async () => {
    await userSetup();
    await scrapTeardown();

    const url = 'http://127.0.0.1:80/scrap';
    const { status } = await axios.post(url, {
      groupChannelUrl: 'CONTROLLER_TEST_CHANNEL_ID',
      messageId: 1,
    });

    expect(status).toBe(201);
  });
});
