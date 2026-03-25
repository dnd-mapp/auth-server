import { MockRoleDB } from '@/role/test';
import { MockUserRoleDB } from '@/user/test';

export class MockPrismaUserRoleDB {
    constructor(
        private readonly db: MockUserRoleDB,
        private readonly roleDb: MockRoleDB
    ) {}

    public async findUnique(params: { where: { userId_roleId: { userId: string; roleId: string } } }) {
        const { userId, roleId } = params.where.userId_roleId;
        const record = this.db.getByComposite(userId, roleId);

        if (!record) return await Promise.resolve(null);
        const role = this.roleDb.getById(roleId);

        return await Promise.resolve(role ? { userId, roleId, role } : null);
    }

    public async findMany(params: { where?: { userId?: string } }) {
        const userId = params?.where?.userId;
        const records = userId ? this.db.getForUser(userId) : [];

        const result = records
            .map((r) => {
                const role = this.roleDb.getById(r.roleId);
                return role ? { userId: r.userId, roleId: r.roleId, role } : null;
            })
            .filter(Boolean);

        return await Promise.resolve(result);
    }

    public async create(params: { data: { userId: string; roleId: string } }) {
        const { userId, roleId } = params.data;

        this.db.add(userId, roleId);

        const role = this.roleDb.getById(roleId);
        return await Promise.resolve({ userId, roleId, role: role! });
    }
}
