import { DatabaseModule } from '@/database';
import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';

@Module({
    imports: [DatabaseModule],
    controllers: [PermissionController],
    providers: [PermissionRepository, PermissionService],
    exports: [PermissionService],
})
export class PermissionModule {}
