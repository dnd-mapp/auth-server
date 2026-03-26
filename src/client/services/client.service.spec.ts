import { ConflictException, NotFoundException } from '@nestjs/common';
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
            const result = await service.create({ name: 'new-client', allowedUris: ['https://example.com'] });
            expect(result).toBeInstanceOf(ClientDto);
            expect(result.name).toBe('new-client');
        });

        it('should throw a ConflictException when name is taken', async () => {
            const { service } = await setupClientTest();
            await expect(service.create({ name: seedClient.name, allowedUris: [] })).rejects.toBeInstanceOf(
                ConflictException
            );
        });
    });

    describe('update', () => {
        it('should return the updated ClientDto', async () => {
            const { service } = await setupClientTest();
            const result = await service.update(seedClient.id, {
                name: 'updated-client',
                allowedUris: ['https://updated.example.com'],
            });
            expect(result).toBeInstanceOf(ClientDto);
            expect(result.name).toBe('updated-client');
        });

        it('should throw a NotFoundException when not found', async () => {
            const { service } = await setupClientTest();
            await expect(service.update(nanoid(), { name: 'updated-client', allowedUris: [] })).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a ConflictException when name is taken', async () => {
            const { service, clientDb } = await setupClientTest();
            clientDb.add('other-client');
            await expect(
                service.update(seedClient.id, { name: 'other-client', allowedUris: [] })
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
});
