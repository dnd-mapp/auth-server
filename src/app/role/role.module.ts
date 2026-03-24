import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { RoleRepository } from './repositories';
import { RoleController } from './role.controller';
import { RoleService } from './services';

@Module({
    imports: [DatabaseModule],
    controllers: [RoleController],
    providers: [RoleRepository, RoleService],
    exports: [RoleService],
})
export class RoleModule {}
