import { MockUserDB } from '@/auth-domain/test';

export class MockPrismaUserDB {
    private db = new MockUserDB();

    public async findMany() {
        return await Promise.resolve(this.db.getAll());
    }

    public async findUnique(params: { where: { id: string } }) {
        const { where } = params;
        return await Promise.resolve(this.db.getById(where.id));
    }
}
