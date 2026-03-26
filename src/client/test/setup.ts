import { DatabaseService } from '@/database';
import { MockPrisma, createTestModule } from '@/test';
import { ClientController } from '../client.controller';
import { ClientModule } from '../client.module';
import { ClientRepository } from '../repositories/client.repository';
import { ClientService } from '../services/client.service';

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
