import { AppConfig, AppConfigurationNamespaces, SecurityConfig } from '@/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ARGON2 } from './tokens';

@Injectable()
export class PasswordService {
    private readonly argon2: typeof import('argon2');
    private readonly configService: ConfigService<AppConfig, true>;

    constructor(@Inject(ARGON2) argon2: typeof import('argon2'), configService: ConfigService<AppConfig, true>) {
        this.argon2 = argon2;
        this.configService = configService;
    }

    async hash(password: string): Promise<string> {
        const config: SecurityConfig = this.configService.get(AppConfigurationNamespaces.SECURITY, { infer: true });
        return this.argon2.hash(password, { secret: Buffer.from(config.passwordPepper) });
    }

    async verify(hash: string, password: string): Promise<boolean> {
        const config: SecurityConfig = this.configService.get(AppConfigurationNamespaces.SECURITY, { infer: true });
        return this.argon2.verify(hash, password, { secret: Buffer.from(config.passwordPepper) });
    }
}
