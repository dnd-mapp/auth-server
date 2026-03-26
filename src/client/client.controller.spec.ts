import { ConflictException, NotFoundException } from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { nanoid } from 'nanoid';
import { ClientDto } from './dtos';
import { seedClient, setupClientTest } from './test';

const mockResponse = { headers: vi.fn() } as unknown as FastifyReply;

describe('ClientController', () => {
    describe('getAll', () => {
        it('should return all clients', async () => {
            const { controller } = await setupClientTest();
            expect(await controller.getAll()).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('should return a ClientDto', async () => {
            const { controller } = await setupClientTest();
            expect(await controller.getById(seedClient.id)).toBeInstanceOf(ClientDto);
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupClientTest();
            await expect(controller.getById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('create', () => {
        it('should return the created ClientDto', async () => {
            const { controller } = await setupClientTest();
            const result = await controller.create(
                { name: 'new-client', allowedUris: ['https://example.com'] },
                mockResponse
            );
            expect(result).toBeInstanceOf(ClientDto);
            expect(result.name).toBe('new-client');
        });
    });

    describe('updateById', () => {
        it('should return the updated ClientDto', async () => {
            const { controller } = await setupClientTest();
            const result = await controller.updateById(seedClient.id, {
                name: 'updated-client',
                allowedUris: ['https://updated.example.com'],
            });
            expect(result).toBeInstanceOf(ClientDto);
            expect(result.name).toBe('updated-client');
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupClientTest();
            await expect(
                controller.updateById(nanoid(), { name: 'updated-client', allowedUris: [] })
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('should throw a ConflictException', async () => {
            const { controller, clientDb } = await setupClientTest();
            clientDb.add('other-client');
            await expect(
                controller.updateById(seedClient.id, { name: 'other-client', allowedUris: [] })
            ).rejects.toBeInstanceOf(ConflictException);
        });
    });

    describe('removeById', () => {
        it('should resolve', async () => {
            const { controller, clientDb } = await setupClientTest();
            const newClient = clientDb.add('some-client');
            await expect(controller.removeById(newClient.id)).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException', async () => {
            const { controller } = await setupClientTest();
            await expect(controller.removeById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
