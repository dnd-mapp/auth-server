import { PrismaLikeClient } from '@/common';
import { MockPrismaUserDB } from './db/mock-prisma-user.db';

export class MockPrisma implements PrismaLikeClient {
    public connected = false;

    public options: Record<string, unknown>;

    public user = new MockPrismaUserDB();

    constructor(options: Record<string, unknown>) {
        this.options = options;
    }

    public async $connect() {
        await Promise.resolve();
        this.connected = true;
    }

    public async $disconnect() {
        await Promise.resolve();
        this.connected = false;
    }
}
