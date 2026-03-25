import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { RoleModule } from '../role';
import { UserRepository, UserRoleRepository } from './repositories';
import { UserRoleService, UserService } from './services';
import { UserController } from './user.controller';

@Module({
    imports: [DatabaseModule, RoleModule],
    controllers: [UserController],
    providers: [UserRepository, UserRoleRepository, UserService, UserRoleService],
    exports: [UserService, UserRoleService],
})
export class UserModule {}
