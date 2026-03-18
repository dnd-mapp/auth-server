import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
    imports: [DatabaseModule],
    providers: [UserRepository, UserService],
})
export class UserModule {}
