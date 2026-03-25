import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { UserModule } from '../user';
import { RoleRepository } from './repositories';
import { RoleController } from './role.controller';
import { RoleService } from './services';

@Module({
    imports: [DatabaseModule, forwardRef(() => UserModule)],
    controllers: [RoleController],
    providers: [RoleRepository, RoleService],
    exports: [RoleService],
})
export class RoleModule {}
