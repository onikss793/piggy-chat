import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { connectToMongoDB } from './mongo';

export const getApp = async () => {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());
  app.use(morgan('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  return app;
};

async function bootstrap() {
  await connectToMongoDB()
    .then(mongoose => console.log('MongoDB Connected', mongoose.models))
    .catch(err => {
      throw err;
    });

  const app = await getApp();

  const PORT = 80;
  await app.listen(PORT)
    .then(() => console.log('Server listening to port: ' + PORT));
}

process.env.NODE_ENV === 'local' && void bootstrap();
