import { DatabaseService } from '@/database';
import { MockPrisma, createTestModule } from '@/test';
import { UserRoleRepository } from '../repositories/user-role.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserRoleService } from '../services/user-role.service';
import { UserService } from '../services/user.service';
import { UserController } from '../user.controller';
import { UserModule } from '../user.module';

export async function setupUserTest() {
    const module = await createTestModule(UserModule);
    const databaseService = module.get(DatabaseService<MockPrisma>);
    return {
        controller: module.get(UserController),
        service: module.get(UserService),
        userRoleService: module.get(UserRoleService),
        repository: module.get(UserRepository),
        userRoleRepository: module.get(UserRoleRepository),
        databaseService,
        userDb: databaseService.prisma.userDb,
        userRoleDb: databaseService.prisma.userRoleDb,
        roleDb: databaseService.prisma.roleDb,
    };
}
