import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { connectToMongoDB } from './database';

async function bootstrap() {
  await connectToMongoDB().then(mongoDB => console.log(mongoDB.models)).catch(err => {
    throw err;
  });

  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const PORT = 80;
  await app.listen(PORT).then(() => console.log('Server listening to port: ' + PORT));
}

void bootstrap();
