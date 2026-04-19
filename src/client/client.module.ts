import { DatabaseModule } from '@dnd-mapp/shared-backend';
import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientRepository } from './repositories';
import { ClientService } from './services';

@Module({
    imports: [DatabaseModule],
    controllers: [ClientController],
    providers: [ClientRepository, ClientService],
    exports: [ClientService],
})
export class ClientModule {}
