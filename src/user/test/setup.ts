import { ARGON2 } from '@/password';
import { MockArgon2, MockConfigService, MockPrisma } from '@/test';
import { DatabaseModule, DatabaseService } from '@dnd-mapp/shared-backend';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UserRepository, UserRoleRepository } from '../repositories';
import { UserRoleService, UserService } from '../services';
import { UserController } from '../user.controller';
import { UserModule } from '../user.module';

export async function setupUserTest() {
    const module = await Test.createTestingModule({
        imports: [DatabaseModule.forRoot(MockPrisma), UserModule],
    })
        .overrideProvider(ConfigService)
        .useFactory({ factory: () => new MockConfigService() })
        .overrideProvider(ARGON2)
        .useValue(MockArgon2)
        .compile();

    module.useLogger(false);
    await module.init();

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
