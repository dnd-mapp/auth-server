import { DatabaseModule } from '@/database';
import { RoleModule } from '@/role/role.module';
import { forwardRef, Module } from '@nestjs/common';
import { UserRepository, UserRoleRepository } from './repositories';
import { UserRoleService, UserService } from './services';
import { UserController } from './user.controller';

@Module({
    imports: [DatabaseModule, forwardRef(() => RoleModule)],
    controllers: [UserController],
    providers: [UserRepository, UserRoleRepository, UserService, UserRoleService],
    exports: [UserService, UserRoleService],
})
export class UserModule {}
