import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { configModuleOptions, provideAppThrottler, throttlerModuleOptions } from './config';
import { HealthModule } from './health/health.module';

@Module({
    imports: [ConfigModule.forRoot(configModuleOptions), ThrottlerModule.forRoot(throttlerModuleOptions), HealthModule],
    providers: [provideAppThrottler()],
})
export class AppModule {}
