import { MockUserDB } from '@/auth-domain/test';

export class MockPrismaUserDB {
    private db = new MockUserDB();

    public async findMany() {
        return await Promise.resolve(this.db.getAll());
    }
}
