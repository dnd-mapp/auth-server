import { MockPrisma, createTestModule } from '@/test';
import { DatabaseService } from '@dnd-mapp/shared-backend';
import { KeyModule } from '../key.module';
import { KeyRepository } from '../key.repository';
import { KeyService } from '../key.service';

export async function setupKeyTest() {
    const module = await createTestModule(KeyModule);
    return {
        service: module.get(KeyService),
        repository: module.get(KeyRepository),
        databaseService: module.get(DatabaseService<MockPrisma>),
        signingKeyDb: module.get(DatabaseService<MockPrisma>).prisma.signingKeyDb,
    };
}
