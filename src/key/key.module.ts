import { DatabaseModule } from '@dnd-mapp/shared-backend';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeyController } from './key.controller';
import { KeyRepository } from './key.repository';
import { KeyService } from './key.service';

@Module({
    imports: [DatabaseModule, ConfigModule],
    controllers: [KeyController],
    providers: [KeyRepository, KeyService],
    exports: [KeyService],
})
export class KeyModule {}
