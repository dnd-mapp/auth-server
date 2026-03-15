import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { provideAppThrottler, throttlerModuleOptions } from './config';
import { HealthModule } from './health/health.module';

@Module({
    imports: [ThrottlerModule.forRoot(throttlerModuleOptions), HealthModule],
    providers: [provideAppThrottler()],
})
export class AppModule {}
