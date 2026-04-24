import { MockSigningKeyDB } from '@/key/test';

export class MockPrismaSigningKeyDB {
    constructor(private readonly db: MockSigningKeyDB) {}

    public async create(params: { data: { privateKey: string; publicKey: string } }) {
        return await Promise.resolve(this.db.add(params.data.privateKey, params.data.publicKey));
    }

    public async findFirst(params?: { where?: { revokedAt?: null }; orderBy?: { createdAt?: string } }) {
        let records = this.db.getAll();

        if (params?.where?.revokedAt === null) {
            records = records.filter((r) => r.revokedAt === null);
        }
        if (params?.orderBy?.createdAt === 'desc') {
            records = [...records].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        return await Promise.resolve(records[0] ?? null);
    }

    public async findMany(params?: { where?: { revokedAt?: null }; orderBy?: { createdAt?: string } }) {
        let records = this.db.getAll();

        if (params?.where?.revokedAt === null) {
            records = records.filter((r) => r.revokedAt === null);
        }
        if (params?.orderBy?.createdAt === 'desc') {
            records = [...records].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        return await Promise.resolve(records);
    }

    public async update(params: { where: { kid: string }; data: { revokedAt: Date } }) {
        this.db.revoke(params.where.kid);
        return await Promise.resolve(this.db.getByKid(params.where.kid)!);
    }
}
