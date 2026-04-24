import { ClientTypes } from '@/client/domain';
import { nanoid } from 'nanoid';
import { ClientDto } from '../dtos';
import { seedClient, setupClientTest } from '../test';

describe('ClientRepository', () => {
    describe('findAll', () => {
        it('should return all clients', async () => {
            const { repository } = await setupClientTest();
            expect(await repository.findAll()).toHaveLength(1);
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupClientTest();
            vi.spyOn(databaseService.prisma.client, 'findMany').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findAll()).rejects.toThrow();
        });
    });

    describe('findById', () => {
        it('should return a ClientDto', async () => {
            const { repository } = await setupClientTest();
            expect(await repository.findById(seedClient.id)).toBeInstanceOf(ClientDto);
        });

        it('should return null for an unknown ID', async () => {
            const { repository } = await setupClientTest();
            expect(await repository.findById(nanoid())).toBeNull();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupClientTest();
            vi.spyOn(databaseService.prisma.client, 'findUnique').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findById(seedClient.id)).rejects.toThrow();
        });
    });

    describe('findByName', () => {
        it('should return a ClientDto', async () => {
            const { repository } = await setupClientTest();
            expect(await repository.findByName(seedClient.name)).toBeInstanceOf(ClientDto);
        });

        it('should return null for an unknown name', async () => {
            const { repository } = await setupClientTest();
            expect(await repository.findByName('unknown-client')).toBeNull();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupClientTest();
            vi.spyOn(databaseService.prisma.client, 'findUnique').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findByName(seedClient.name)).rejects.toThrow();
        });
    });

    describe('create', () => {
        it('should return the created ClientDto without URIs', async () => {
            const { repository } = await setupClientTest();
            const result = await repository.create({
                name: 'new-client',
                allowedUris: [],
                clientType: ClientTypes.PUBLIC,
                clientSecret: null,
            });
            expect(result).toBeInstanceOf(ClientDto);
            expect(result.name).toBe('new-client');
            expect(result.allowedUris).toHaveLength(0);
        });

        it('should return the created ClientDto with URIs', async () => {
            const { repository } = await setupClientTest();
            const result = await repository.create({
                name: 'new-client',
                allowedUris: ['https://example.com'],
                clientType: ClientTypes.PUBLIC,
                clientSecret: null,
            });
            expect(result).toBeInstanceOf(ClientDto);
            expect(result.allowedUris).toEqual(['https://example.com']);
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupClientTest();
            vi.spyOn(databaseService.prisma.client, 'create').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(
                repository.create({
                    name: 'new-client',
                    allowedUris: [],
                    clientType: ClientTypes.PUBLIC,
                    clientSecret: null,
                })
            ).rejects.toThrow();
        });
    });

    describe('update', () => {
        it('should return the updated ClientDto and replace URIs', async () => {
            const { repository } = await setupClientTest();
            const result = await repository.update(seedClient.id, {
                name: 'updated-client',
                allowedUris: ['https://new.example.com'],
                clientType: ClientTypes.PUBLIC,
                clientSecret: null,
            });
            expect(result).toBeInstanceOf(ClientDto);
            expect(result.name).toBe('updated-client');
            expect(result.allowedUris).toEqual(['https://new.example.com']);
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupClientTest();
            vi.spyOn(databaseService.prisma.client, 'update').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(
                repository.update(seedClient.id, {
                    name: 'updated-client',
                    allowedUris: [],
                    clientType: ClientTypes.PUBLIC,
                    clientSecret: null,
                })
            ).rejects.toThrow();
        });
    });

    describe('deleteById', () => {
        it('should resolve', async () => {
            const { repository } = await setupClientTest();
            await expect(repository.deleteById(seedClient.id)).resolves.toBeUndefined();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupClientTest();
            vi.spyOn(databaseService.prisma.client, 'delete').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.deleteById(seedClient.id)).rejects.toThrow();
        });
    });
});
