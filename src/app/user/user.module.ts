import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { UserRepository } from './repositories';
import { UserService } from './services';
import { UserController } from './user.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserRepository, UserService],
    exports: [UserService],
})
export class UserModule {}
