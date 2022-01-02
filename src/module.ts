import { Module } from '@nestjs/common';
import { ControllerModule } from './controller';

@Module({
  imports: [ControllerModule],
  providers: [],
})
export class AppModule {}
