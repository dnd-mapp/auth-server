import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { UserRepository, UserRoleRepository } from './repositories';
import { UserRoleService, UserService } from './services';
import { UserController } from './user.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserRepository, UserRoleRepository, UserService, UserRoleService],
    exports: [UserService, UserRoleService],
})
export class UserModule {}
