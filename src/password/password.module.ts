import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PasswordService } from './password.service';
import { ARGON2 } from './tokens';

@Module({
    imports: [ConfigModule],
    providers: [{ provide: ARGON2, useValue: argon2 }, PasswordService],
    exports: [PasswordService],
})
export class PasswordModule {}
