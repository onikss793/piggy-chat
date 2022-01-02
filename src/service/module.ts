import { Module } from '@nestjs/common';
import { ExternalModule } from '../external/module';
import { AuthService } from './auth';

@Module({
	imports: [ExternalModule],
	providers: [AuthService],
	exports: [AuthService]
})
export class ServiceModule {}
