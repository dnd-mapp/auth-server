import { nanoid } from 'nanoid';
import { UserDto } from '../dtos';
import { setupUserTest, theLegend27 } from '../test';

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

    describe('create', () => {
        it('should return the created UserDto', async () => {
            const { repository } = await setupUserTest();
            const result = await repository.create({ username: 'NewUser', roleIds: [] });
            expect(result).toBeInstanceOf(UserDto);
            expect(result.username).toBe('NewUser');
        });

        it('should throw a database error', async () => {
            const { repository, databaseService } = await setupUserTest();
            vi.spyOn(databaseService.prisma.user, 'create').mockImplementationOnce(() =>
                Promise.reject(new Error('not connected'))
            );
            await expect(repository.create({ username: 'NewUser', roleIds: [] })).rejects.toThrow();
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
