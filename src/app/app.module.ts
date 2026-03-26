import { ClientModule } from '@/client/client.module';
import { DatabaseModule } from '@/database';
import { PermissionModule } from '@/permission/permission.module';
import { PrismaClient } from '@/prisma/client';
import { RoleModule } from '@/role/role.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { configModuleOptions, provideAppThrottler, provideGlobalSerialization, throttlerModuleOptions } from './config';
import { HealthModule } from './health/health.module';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        ThrottlerModule.forRoot(throttlerModuleOptions),
        HealthModule,
        DatabaseModule.forRoot(PrismaClient),
        UserModule,
        PermissionModule,
        RoleModule,
        ClientModule,
    ],
    providers: [provideAppThrottler(), provideGlobalSerialization()],
})
export class AppModule {}
