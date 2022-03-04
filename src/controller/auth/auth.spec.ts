import axios from 'axios';
import * as Mongoose from 'mongoose';
import { connectToMongoDB } from '../../mongo';
import { userSetup } from '../../test-utils';

let mongoose: typeof Mongoose;

beforeAll(async () => {
  mongoose = await connectToMongoDB();
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Controller Test', () => {
  test('login() should return login Data', async () => {
    await userSetup();

    const url = 'http://127.0.0.1:80/auth/login';
    const { data, status } = await axios.get(url);

    expect(status).toBe(200);
  });
});
