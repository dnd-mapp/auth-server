import { DatabaseModule, DatabaseService } from '@/database';
import { MockConfigService, MockPrisma } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PermissionController } from '../permission.controller';
import { PermissionModule } from '../permission.module';
import { PermissionRepository } from '../permission.repository';
import { PermissionService } from '../permission.service';

export async function setupPermissionTest() {
    const module = await Test.createTestingModule({
        imports: [DatabaseModule.forRoot(MockPrisma), PermissionModule],
    })
        .overrideProvider(ConfigService)
        .useFactory({ factory: () => new MockConfigService() })
        .compile();

    module.useLogger(false);
    await module.init();

    return {
        controller: module.get(PermissionController),
        service: module.get(PermissionService),
        repository: module.get(PermissionRepository),
        databaseService: module.get(DatabaseService<MockPrisma>),
    };
}
