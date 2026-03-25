import { seedRole } from '@/role/test';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { UserDto } from '../dtos';
import { setupUserTest, theLegend27 } from '../test';

describe('UserService', () => {
    it('should return all users', async () => {
        const { service } = await setupUserTest();
        expect(await service.getAll()).toHaveLength(1);
    });

    it('should return a user by ID', async () => {
        const { service } = await setupUserTest();
        expect(await service.getById(theLegend27.id)).toBeInstanceOf(UserDto);
    });

    describe('create', () => {
        it('should return the created UserDto', async () => {
            const { service } = await setupUserTest();
            const result = await service.create({ username: 'NewUser', roleIds: [seedRole.id] });
            expect(result).toBeInstanceOf(UserDto);
            expect(result.username).toBe('NewUser');
        });

        it('should throw a ConflictException when username is taken', async () => {
            const { service } = await setupUserTest();
            await expect(
                service.create({ username: theLegend27.username, roleIds: [seedRole.id] })
            ).rejects.toBeInstanceOf(ConflictException);
        });

        it('should throw a NotFoundException when a roleId does not exist', async () => {
            const { service } = await setupUserTest();
            await expect(service.create({ username: 'NewUser', roleIds: [nanoid()] })).rejects.toBeInstanceOf(
                NotFoundException
            );
        });
    });

    describe('update', () => {
        it('should return the updated UserDto', async () => {
            const { service } = await setupUserTest();
            const result = await service.update(theLegend27.id, { username: 'UpdatedLegend' });
            expect(result).toBeInstanceOf(UserDto);
            expect(result.username).toBe('UpdatedLegend');
        });

        it('should throw a NotFoundException when user not found', async () => {
            const { service } = await setupUserTest();
            await expect(service.update(nanoid(), { username: 'UpdatedLegend' })).rejects.toBeInstanceOf(
                NotFoundException
            );
        });

        it('should throw a ConflictException when username is taken', async () => {
            const { service, userDb } = await setupUserTest();
            userDb.add('AnotherUser');
            await expect(service.update(theLegend27.id, { username: 'AnotherUser' })).rejects.toBeInstanceOf(
                ConflictException
            );
        });
    });

    describe('removeById', () => {
        it('should resolve', async () => {
            const { service } = await setupUserTest();
            await expect(service.removeById(theLegend27.id)).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException when not found', async () => {
            const { service } = await setupUserTest();
            await expect(service.removeById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('purgeById', () => {
        it('should resolve', async () => {
            const { service } = await setupUserTest();
            await service.removeById(theLegend27.id);
            await expect(service.purgeById(theLegend27.id)).resolves.toBeUndefined();
        });

        it('should throw a NotFoundException when not found', async () => {
            const { service } = await setupUserTest();
            await expect(service.purgeById(nanoid())).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
