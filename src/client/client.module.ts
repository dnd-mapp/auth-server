import { DatabaseModule } from '@dnd-mapp/shared-backend';
import { Module } from '@nestjs/common';
import { PasswordModule } from '../password/password.module';
import { ClientController } from './client.controller';
import { ClientRepository } from './repositories';
import { ClientService } from './services';

@Module({
    imports: [DatabaseModule, PasswordModule],
    controllers: [ClientController],
    providers: [ClientRepository, ClientService],
    exports: [ClientService],
})
export class ClientModule {}
