import { MockPrisma, createTestModule } from '@/test';
import { DatabaseService } from '@dnd-mapp/shared-backend';
import { ClientController } from '../client.controller';
import { ClientModule } from '../client.module';
import { ClientRepository } from '../repositories';
import { ClientService } from '../services';

export async function setupClientTest() {
    const module = await createTestModule(ClientModule);
    return {
        controller: module.get(ClientController),
        service: module.get(ClientService),
        repository: module.get(ClientRepository),
        databaseService: module.get(DatabaseService<MockPrisma>),
        clientDb: module.get(DatabaseService<MockPrisma>).prisma.clientDb,
    };
}
