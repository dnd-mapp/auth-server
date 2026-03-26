import { DatabaseModule } from '@/database';
import { PermissionModule } from '@/permission/permission.module';
import { UserModule } from '@/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { RolePermissionRepository, RoleRepository } from './repositories';
import { RoleController } from './role.controller';
import { RolePermissionService, RoleService } from './services';

@Module({
    imports: [DatabaseModule, PermissionModule, forwardRef(() => UserModule)],
    controllers: [RoleController],
    providers: [RoleRepository, RoleService, RolePermissionRepository, RolePermissionService],
    exports: [RoleService, RolePermissionService],
})
export class RoleModule {}
