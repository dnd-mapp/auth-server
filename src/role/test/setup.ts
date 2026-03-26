import { DatabaseService } from '@/database';
import { MockPrisma, createTestModule } from '@/test';
import { RolePermissionRepository } from '../repositories/role-permission.repository';
import { RoleRepository } from '../repositories/role.repository';
import { RoleController } from '../role.controller';
import { RoleModule } from '../role.module';
import { RolePermissionService } from '../services/role-permission.service';
import { RoleService } from '../services/role.service';

export async function setupRoleTest() {
    const module = await createTestModule(RoleModule);
    const databaseService = module.get(DatabaseService<MockPrisma>);
    return {
        controller: module.get(RoleController),
        service: module.get(RoleService),
        rolePermissionService: module.get(RolePermissionService),
        repository: module.get(RoleRepository),
        rolePermissionRepository: module.get(RolePermissionRepository),
        databaseService,
        roleDb: databaseService.prisma.roleDb,
        rolePermissionDb: databaseService.prisma.rolePermissionDb,
        permissionDb: databaseService.prisma.permissionDb,
    };
}
