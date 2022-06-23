import { configure } from '@vendia/serverless-express';
import type { Callback, Context, Handler } from 'aws-lambda';
import { getApp } from './main';
import { connectToMongoDB } from './mongo';

let server: Handler;
let mongoose: typeof import('mongoose');

async function connect(): Promise<typeof import('mongoose')> {
  return connectToMongoDB()
    .then(mongoose => {
      console.log('MongoDB Connected', mongoose.models);
      return mongoose;
    })
    .catch(err => {
      throw err;
    });
}

async function bootstrap(): Promise<Handler> {
  const app = await getApp();
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return configure({ app: expressApp });
}

export const handler: Handler = async (
  event: unknown,
  context: Context,
  callback: Callback,
) => {
  mongoose = mongoose ?? (await connect());
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
