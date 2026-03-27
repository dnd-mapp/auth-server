import { nanoid } from 'nanoid';
import { UserDto } from '../dtos';
import { LEGEND_EMAIL, setupUserTest, theLegend27 } from '../test';

describe('UserRepository', () => {
    describe('findAll', () => {
        it('should return all users', async () => {
            const { repository } = await setupUserTest();
            expect(await repository.findAll()).toHaveLength(1);
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupUserTest();
            vi.spyOn(databaseService.prisma.user, 'findMany').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findAll()).rejects.toThrow();
        });
    });

    describe('findById', () => {
        it('should return a user by ID', async () => {
            const { repository } = await setupUserTest();
            expect(await repository.findById(theLegend27.id)).toBeInstanceOf(UserDto);
        });

        it('should return null', async () => {
            const { repository } = await setupUserTest();
            expect(await repository.findById(nanoid())).toBeNull();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupUserTest();
            vi.spyOn(databaseService.prisma.user, 'findUnique').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findById(theLegend27.id)).rejects.toThrow();
        });
    });

    describe('findByUsername', () => {
        it('should return a UserDto', async () => {
            const { repository } = await setupUserTest();
            expect(await repository.findByUsername(theLegend27.username)).toBeInstanceOf(UserDto);
        });

        it('should return null for unknown username', async () => {
            const { repository } = await setupUserTest();
            expect(await repository.findByUsername('UnknownUser')).toBeNull();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupUserTest();
            vi.spyOn(databaseService.prisma.user, 'findUnique').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findByUsername(theLegend27.username)).rejects.toThrow();
        });
    });

    describe('findByEmail', () => {
        it('should return a UserDto', async () => {
            const { repository } = await setupUserTest();
            expect(await repository.findByEmail(LEGEND_EMAIL)).toBeInstanceOf(UserDto);
        });

        it('should return null for unknown email', async () => {
            const { repository } = await setupUserTest();
            expect(await repository.findByEmail('unknown@example.com')).toBeNull();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupUserTest();
            vi.spyOn(databaseService.prisma.user, 'findUnique').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.findByEmail(LEGEND_EMAIL)).rejects.toThrow();
        });
    });

    describe('create', () => {
        it('should return the created UserDto', async () => {
            const { repository } = await setupUserTest();
            const result = await repository.create({
                username: 'NewUser',
                email: 'newuser@example.com',
                roleIds: [],
                password: '$argon2id$v=19$...(mock hash)',
            });
            expect(result).toBeInstanceOf(UserDto);
            expect(result.username).toBe('NewUser');
            expect(result.email).toBe('newuser@example.com');
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupUserTest();
            vi.spyOn(databaseService.prisma.user, 'create').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(
                repository.create({
                    username: 'NewUser',
                    email: 'newuser@example.com',
                    roleIds: [],
                    password: '$argon2id$v=19$...(mock hash)',
                })
            ).rejects.toThrow();
        });
    });

    describe('update', () => {
        it('should return the updated UserDto', async () => {
            const { repository } = await setupUserTest();
            const result = await repository.update(theLegend27.id, { username: 'UpdatedLegend' });
            expect(result).toBeInstanceOf(UserDto);
            expect(result.username).toBe('UpdatedLegend');
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupUserTest();
            vi.spyOn(databaseService.prisma.user, 'update').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.update(theLegend27.id, { username: 'UpdatedLegend' })).rejects.toThrow();
        });
    });

    describe('softDeleteById', () => {
        it('should resolve', async () => {
            const { repository } = await setupUserTest();
            await expect(repository.softDeleteById(theLegend27.id)).resolves.toBeUndefined();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupUserTest();
            vi.spyOn(databaseService.prisma.user, 'update').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.softDeleteById(theLegend27.id)).rejects.toThrow();
        });
    });

    describe('purgeById', () => {
        it('should resolve', async () => {
            const { repository } = await setupUserTest();
            await expect(repository.purgeById(theLegend27.id)).resolves.toBeUndefined();
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupUserTest();
            vi.spyOn(databaseService.prisma.user, 'delete').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.purgeById(theLegend27.id)).rejects.toThrow();
        });
    });
});
