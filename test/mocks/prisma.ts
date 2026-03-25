import { PrismaLikeClient } from '@/common';
import { MockPermissionDB } from '@/permission/test';
import { MockRoleDB } from '@/role/test';
import { MockUserDB, MockUserRoleDB } from '@/user/test';
import { MockPrismaPermissionDB } from './db/mock-prisma-permission.db';
import { MockPrismaRoleDB } from './db/mock-prisma-role.db';
import { MockPrismaUserRoleDB } from './db/mock-prisma-user-role.db';
import { MockPrismaUserDB } from './db/mock-prisma-user.db';

export class MockPrisma implements PrismaLikeClient {
    public connected = false;
    public options: Record<string, unknown>;

    private readonly mockPermissionDB = new MockPermissionDB();
    private readonly mockRoleDB = new MockRoleDB();
    private readonly mockUserRoleDB = new MockUserRoleDB();
    private readonly mockUserDB = new MockUserDB();

    public permission = new MockPrismaPermissionDB(this.mockPermissionDB);
    public role = new MockPrismaRoleDB(this.mockRoleDB);
    public userRole = new MockPrismaUserRoleDB(this.mockUserRoleDB, this.mockRoleDB);
    public user = new MockPrismaUserDB(this.mockUserDB, this.mockUserRoleDB);

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

    public async $runCommandRaw(_command: unknown) {
        return await Promise.resolve();
    }
}
