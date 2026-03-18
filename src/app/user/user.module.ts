import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { UserRepository } from './user.repository';
@Module({
    providers: [UserRepository],
    imports: [DatabaseModule],
})
export class UserModule {}
