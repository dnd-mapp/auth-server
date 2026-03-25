import { DatabaseModule, DatabaseService } from '@/database';
import { MockConfigService, MockPrisma } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UserRoleRepository } from '../repositories/user-role.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserRoleService } from '../services/user-role.service';
import { UserService } from '../services/user.service';
import { UserController } from '../user.controller';
import { UserModule } from '../user.module';

export async function setupUserTest() {
    const module = await Test.createTestingModule({
        imports: [DatabaseModule.forRoot(MockPrisma), UserModule],
    })
        .overrideProvider(ConfigService)
        .useFactory({ factory: () => new MockConfigService() })
        .compile();

    module.useLogger(false);
    await module.init();

    return {
        controller: module.get(UserController),
        service: module.get(UserService),
        userRoleService: module.get(UserRoleService),
        repository: module.get(UserRepository),
        userRoleRepository: module.get(UserRoleRepository),
        databaseService: module.get(DatabaseService<MockPrisma>),
    };
}
