import { PasswordModule } from '@/password';
import { RoleModule } from '@/role/role.module';
import { DatabaseModule } from '@dnd-mapp/shared-backend';
import { forwardRef, Module } from '@nestjs/common';
import { UserRepository, UserRoleRepository } from './repositories';
import { UserRoleService, UserService } from './services';
import { UserController } from './user.controller';

@Module({
    imports: [DatabaseModule, forwardRef(() => RoleModule), PasswordModule],
    controllers: [UserController],
    providers: [UserRepository, UserRoleRepository, UserService, UserRoleService],
    exports: [UserService, UserRoleService],
})
export class UserModule {}
