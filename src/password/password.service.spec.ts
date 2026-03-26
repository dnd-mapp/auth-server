import { MockArgon2, MockConfigService } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PasswordService } from './password.service';
import { ARGON2 } from './tokens';

describe('PasswordService', () => {
    const pepper = 'test-pepper';

    async function setup() {
        const module = await Test.createTestingModule({
            providers: [
                PasswordService,
                { provide: ARGON2, useValue: MockArgon2 },
                { provide: ConfigService, useClass: MockConfigService },
            ],
        }).compile();

        return { service: module.get(PasswordService) };
    }

    describe('hash', () => {
        it('should hash the password with the configured pepper', async () => {
            const { service } = await setup();
            expect(await service.hash('my-plain-password')).toBe(`$argon2id$mock:${pepper}:my-plain-password`);
        });
    });

    describe('verify', () => {
        it('should return true when hash matches the password and pepper', async () => {
            const { service } = await setup();
            expect(await service.verify(`$argon2id$mock:${pepper}:my-plain-password`, 'my-plain-password')).toBe(true);
        });

        it('should return false when the pepper does not match', async () => {
            const { service } = await setup();
            expect(await service.verify(`$argon2id$mock:wrong-pepper:my-plain-password`, 'my-plain-password')).toBe(
                false
            );
        });
    });
});
