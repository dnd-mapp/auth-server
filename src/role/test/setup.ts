import { DatabaseService } from '@/database';
import { MockPrisma, createTestModule } from '@/test';
import { RoleRepository } from '../repositories/role.repository';
import { RoleController } from '../role.controller';
import { RoleModule } from '../role.module';
import { RoleService } from '../services/role.service';

export async function setupRoleTest() {
    const module = await createTestModule(RoleModule);
    return {
        controller: module.get(RoleController),
        service: module.get(RoleService),
        repository: module.get(RoleRepository),
        databaseService: module.get(DatabaseService<MockPrisma>),
        roleDb: module.get(DatabaseService<MockPrisma>).prisma.roleDb,
    };
}
