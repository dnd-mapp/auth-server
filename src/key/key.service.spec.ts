import { setupKeyTest } from './test';

describe('KeyService', () => {
    describe('generateAndPersist', () => {
        it('should generate and persist an RS512 key pair', async () => {
            const { service, signingKeyDb } = await setupKeyTest();
            const beforeCount = signingKeyDb.getAll().length;
            const result = await service.generateAndPersist();

            expect(result.kid).toBeDefined();
            expect(result.algorithm).toBe('RS512');
            expect(result.publicKey).toContain('BEGIN PUBLIC KEY');
            expect(signingKeyDb.getAll()).toHaveLength(beforeCount + 1);
        });

        it('should encrypt the private key before persisting', async () => {
            const { service, signingKeyDb } = await setupKeyTest();
            const result = await service.generateAndPersist();
            const stored = signingKeyDb.getByKid(result.kid)!;

            expect(stored.privateKey).not.toContain('BEGIN PRIVATE KEY');
            expect(stored.privateKey).toMatch(/^[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/);
        });
    });

    describe('getActiveSigningKey', () => {
        it('should return the most recent non-revoked key with decrypted private key', async () => {
            const { service } = await setupKeyTest();
            const result = await service.getActiveSigningKey();

            expect(result.kid).toBeDefined();
            expect(result.privateKeyPem).toContain('BEGIN PRIVATE KEY');
        });

        it('should throw when no active key exists', async () => {
            const { service, signingKeyDb } = await setupKeyTest();

            signingKeyDb.getAll().forEach((k) => signingKeyDb.revoke(k.kid));

            await expect(service.getActiveSigningKey()).rejects.toThrow('No active signing key available');
        });
    });

    describe('getActivePublicKeys', () => {
        it('should return all non-revoked keys', async () => {
            const { service, signingKeyDb } = await setupKeyTest();
            const bootstrapKey = signingKeyDb.getAll()[0]!;
            signingKeyDb.revoke(bootstrapKey.kid);

            const key1 = await service.generateAndPersist();
            const key2 = await service.generateAndPersist();
            signingKeyDb.revoke(key1.kid);

            const result = await service.getActivePublicKeys();
            expect(result).toHaveLength(1);
            expect(result[0]!.kid).toBe(key2.kid);
        });

        it('should return empty array when all keys are revoked', async () => {
            const { service, signingKeyDb } = await setupKeyTest();

            signingKeyDb.getAll().forEach((k) => signingKeyDb.revoke(k.kid));

            expect(await service.getActivePublicKeys()).toHaveLength(0);
        });
    });

    describe('buildJwks', () => {
        it('should return JWKS with kid and alg fields for each active key', async () => {
            const { service } = await setupKeyTest();
            const jwks = await service.buildJwks();

            expect(jwks.keys.length).toBeGreaterThan(0);
            for (const entry of jwks.keys) {
                expect(entry).toMatchObject({ alg: 'RS512' });
                expect((entry as Record<string, unknown>)['kid']).toBeDefined();
            }
        });
    });

    describe('onApplicationBootstrap', () => {
        it('should generate a key on first boot', async () => {
            const { signingKeyDb } = await setupKeyTest();
            expect(signingKeyDb.getAll().length).toBeGreaterThan(0);
        });

        it('should not generate a second key when one already exists', async () => {
            const { service, signingKeyDb } = await setupKeyTest();
            const countBefore = signingKeyDb.getAll().length;

            await service.onApplicationBootstrap();

            expect(signingKeyDb.getAll()).toHaveLength(countBefore);
        });

        it('should generate a new key when all existing keys are revoked', async () => {
            const { service, signingKeyDb } = await setupKeyTest();

            signingKeyDb.getAll().forEach((k) => signingKeyDb.revoke(k.kid));
            const countBefore = signingKeyDb.getAll().length;
            await service.onApplicationBootstrap();

            expect(signingKeyDb.getAll()).toHaveLength(countBefore + 1);
        });
    });
});
