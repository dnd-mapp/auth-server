import { ClientModule } from '@/client/client.module';
import { KeyModule } from '@/key/key.module';
import { PermissionModule } from '@/permission/permission.module';
import { PrismaClient } from '@/prisma/client';
import { RoleModule } from '@/role/role.module';
import { UserModule } from '@/user/user.module';
import {
    createThrottlerOptions,
    DatabaseModule,
    HealthModule,
    provideAppThrottler,
    provideGlobalSerialization,
} from '@dnd-mapp/shared-backend';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { configModuleOptions } from './config';
import { HealthController } from './health/health.controller';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        ThrottlerModule.forRoot(createThrottlerOptions()),
        HealthModule.forRoot(HealthController),
        DatabaseModule.forRoot(PrismaClient),
        UserModule,
        PermissionModule,
        RoleModule,
        ClientModule,
        KeyModule,
    ],
    providers: [provideAppThrottler(), provideGlobalSerialization()],
})
export class AppModule {}
