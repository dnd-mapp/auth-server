import { PrismaClient } from '@/prisma/client';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { configModuleOptions, provideAppThrottler, provideGlobalSerialization, throttlerModuleOptions } from './config';
import { DatabaseModule } from './database';
import { HealthModule } from './health/health.module';
import { UserModule } from './user';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        ThrottlerModule.forRoot(throttlerModuleOptions),
        HealthModule,
        DatabaseModule.forRoot(PrismaClient),
        UserModule,
    ],
    providers: [provideAppThrottler(), provideGlobalSerialization()],
})
export class AppModule {}
