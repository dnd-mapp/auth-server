import { DatabaseModule, DatabaseService } from '@/database';
import { MockConfigService, MockPrisma } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { RoleRepository } from '../repositories/role.repository';
import { RoleController } from '../role.controller';
import { RoleModule } from '../role.module';
import { RoleService } from '../services/role.service';

export async function setupRoleTest() {
    const module = await Test.createTestingModule({
        imports: [DatabaseModule.forRoot(MockPrisma), RoleModule],
    })
        .overrideProvider(ConfigService)
        .useFactory({ factory: () => new MockConfigService() })
        .compile();

    module.useLogger(false);
    await module.init();

    return {
        controller: module.get(RoleController),
        service: module.get(RoleService),
        repository: module.get(RoleRepository),
        databaseService: module.get(DatabaseService<MockPrisma>),
    };
}
