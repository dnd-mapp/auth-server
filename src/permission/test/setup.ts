import { MockPrisma, createTestModule } from '@/test';
import { DatabaseService } from '@dnd-mapp/shared-backend';
import { PermissionController } from '../permission.controller';
import { PermissionModule } from '../permission.module';
import { PermissionRepository } from '../permission.repository';
import { PermissionService } from '../permission.service';

export async function setupPermissionTest() {
    const module = await createTestModule(PermissionModule);
    return {
        controller: module.get(PermissionController),
        service: module.get(PermissionService),
        repository: module.get(PermissionRepository),
        databaseService: module.get(DatabaseService<MockPrisma>),
        permissionDb: module.get(DatabaseService<MockPrisma>).prisma.permissionDb,
    };
}
