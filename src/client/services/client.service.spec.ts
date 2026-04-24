import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { ClientDto } from '../dtos';
import { seedClient, setupClientTest } from '../test';

describe('ClientService', () => {
    describe('getAll', () => {
        it('should return all clients', async () => {
            const { service } = await setupClientTest();
            expect(await service.getAll()).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('should return a ClientDto', async () => {
            const { service } = await setupClientTest();
            expect(await service.getById(seedClient.id)).toBeInstanceOf(ClientDto);
        });

        it('should return null for unknown ID', async () => {
            const { service } = await setupClientTest();
            expect(await service.getById(nanoid())).toBeNull();
        });
    });

    describe('create', () => {
        it('should return the created ClientDto', async () => {
            const { service } = await setupClientTest();
            const result = await service.create({
                name: 'new-client',
                allowedUris: ['https://example.com'],
                clientType: 'public',
            });
            expect(result).toBeInstanceOf(ClientDto);
            expect(result.name).toBe('new-client');
        });

        it('should throw a ConflictException when name is taken', async () => {
            const { service } = await setupClientTest();
            await expect(
                service.create({ name: seedClient.name, allowedUris: [], clientType: 'public' })
            ).rejects.toBeInstanceOf(ConflictException);
        });

        it('should throw a BadRequestException when creating a confidential client without a secret', async () => {
            const { service } = await setupClientTest();
            await expect(
                service.create({ name: 'conf-client', allowedUris: [], clientType: 'confidential' })
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('should throw a BadRequestException when creating a public client with a secret', async () => {
            const { service } = await setupClientTest();
            await expect(
                service.create({ name: 'pub-client', allowedUris: [], clientType: 'public', clientSecret: 'secret' })
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it('should hash the secret when creating a confidential client', async () => {
            const { service } = await setupClientTest();
            const result = await service.create({
                name: 'conf-client',
                allowedUris: [],
                clientType: 'confidential',
                clientSecret: 'my-secret',
            });
            expect(result).toBeInstanceOf(ClientDto);
            expect(result.clientType).toBe('confidential');
        });
    });

    describe('update', () => {
        it('should return the updated ClientDto', async () => {
            const { service } = await setupClientTest();
            const result = await service.update(seedClient.id, {
                name: 'updated-client',
                allowedUris: ['https://updated.example.com'],
                clientType: 'public',
            });
            expect(result).toBeInstanceOf(ClientDto);
            expect(result.name).toBe('updated-client');
        });

        it('should throw a NotFoundException when not found', async () => {
            const { service } = await setupClientTest();
            await expect(
                service.update(nanoid(), { name: 'updated-client', allowedUris: [], clientType: 'public' })
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a ConflictException when name is taken', async () => {
            const { service, clientDb } = await setupClientTest();
            clientDb.add('other-client');
            await expect(
                service.update(seedClient.id, { name: 'other-client', allowedUris: [], clientType: 'public' })
            ).rejects.toBeInstanceOf(ConflictException);
        });
    });

    describe('removeById', () => {
        it('should resolve', async () => {
            const { service, clientDb } = await setupClientTest();
            const newClient = clientDb.add('some-client');
            await expect(service.removeById(newClient.id)).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException when not found', async () => {
            const { service } = await setupClientTest();
            await expect(service.removeById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('verifyClientSecret', () => {
        it('should return true for a correct secret', async () => {
            const { service, clientDb } = await setupClientTest();
            const client = await service.create({
                name: 'conf-client',
                allowedUris: [],
                clientType: 'confidential',
                clientSecret: 'correct-secret',
            });
            expect(await service.verifyClientSecret(client.id, 'correct-secret')).toBe(true);
        });

        it('should return false for an incorrect secret', async () => {
            const { service } = await setupClientTest();
            const client = await service.create({
                name: 'conf-client',
                allowedUris: [],
                clientType: 'confidential',
                clientSecret: 'correct-secret',
            });
            expect(await service.verifyClientSecret(client.id, 'wrong-secret')).toBe(false);
        });

        it('should return false for a public client with no secret', async () => {
            const { service } = await setupClientTest();
            expect(await service.verifyClientSecret(seedClient.id, 'any-secret')).toBe(false);
        });
    });

    describe('parseClientSecretBasic', () => {
        it('should parse a valid Basic auth header', async () => {
            const { service } = await setupClientTest();
            const encoded = Buffer.from('my-client-id:my-secret').toString('base64');
            expect(service.parseClientSecretBasic(`Basic ${encoded}`)).toEqual({
                clientId: 'my-client-id',
                secret: 'my-secret',
            });
        });

        it('should handle a secret containing a colon', async () => {
            const { service } = await setupClientTest();
            const encoded = Buffer.from('client-id:secret:with:colons').toString('base64');
            expect(service.parseClientSecretBasic(`Basic ${encoded}`)).toEqual({
                clientId: 'client-id',
                secret: 'secret:with:colons',
            });
        });

        it('should throw a BadRequestException for non-Basic auth header', async () => {
            const { service } = await setupClientTest();
            expect(() => service.parseClientSecretBasic('Bearer token')).toThrow(BadRequestException);
        });
    });
});
