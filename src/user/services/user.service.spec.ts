import { seedRole } from '@/role/test';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { UserDto } from '../dtos';
import { LEGEND_EMAIL, setupUserTest, theLegend27 } from '../test';

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
            const result = await service.create({
                username: 'NewUser',
                email: 'newuser@example.com',
                roleIds: [seedRole.id],
                password: 'correct-horse-battery-staple',
            });
            expect(result).toBeInstanceOf(UserDto);
            expect(result.username).toBe('NewUser');
            expect(result.email).toBe('newuser@example.com');
        });

        it('should store the hashed password, not the plain password', async () => {
            const { service, userDb } = await setupUserTest();
            await service.create({
                username: 'NewUser',
                email: 'newuser@example.com',
                roleIds: [seedRole.id],
                password: 'correct-horse-battery-staple',
            });
            const record = userDb.getByUsername('NewUser');
            expect(record?.password).not.toBe('correct-horse-battery-staple');
            expect(record?.password).toMatch(/^\$argon2id\$mock:/);
        });

        it('should throw a ConflictException when username is taken', async () => {
            const { service } = await setupUserTest();
            await expect(
                service.create({
                    username: theLegend27.username,
                    email: 'newuser@example.com',
                    roleIds: [seedRole.id],
                    password: 'correct-horse-battery-staple',
                })
            ).rejects.toBeInstanceOf(ConflictException);
        });

        it('should throw a ConflictException when email is taken', async () => {
            const { service } = await setupUserTest();
            await expect(
                service.create({
                    username: 'NewUser',
                    email: LEGEND_EMAIL,
                    roleIds: [seedRole.id],
                    password: 'correct-horse-battery-staple',
                })
            ).rejects.toBeInstanceOf(ConflictException);
        });

        it('should throw a NotFoundException when a roleId does not exist', async () => {
            const { service } = await setupUserTest();
            await expect(
                service.create({
                    username: 'NewUser',
                    email: 'newuser@example.com',
                    roleIds: [nanoid()],
                    password: 'correct-horse-battery-staple',
                })
            ).rejects.toBeInstanceOf(NotFoundException);
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
            userDb.add('AnotherUser', 'anotheruser@example.com', '$argon2id$v=19$...(mock hash)');
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
