import { seedRole } from '../../role/test/mock-role.db';
import { LEGEND_USER_ID } from './mock-user.db';

interface UserRoleRecord {
    userId: string;
    roleId: string;
}

export class MockUserRoleDB {
    private records: UserRoleRecord[] = [{ userId: LEGEND_USER_ID, roleId: seedRole.id }];

    public getForUser(userId: string): UserRoleRecord[] {
        return this.records.filter((r) => r.userId === userId);
    }

    public getForRole(roleId: string): UserRoleRecord[] {
        return this.records.filter((r) => r.roleId === roleId);
    }

    public getByComposite(userId: string, roleId: string): UserRoleRecord | null {
        return this.records.find((r) => r.userId === userId && r.roleId === roleId) ?? null;
    }

    public add(userId: string, roleId: string): UserRoleRecord {
        const record: UserRoleRecord = { userId, roleId };

        this.records.push(record);
        return record;
    }

    public remove(userId: string, roleId: string): void {
        this.records = this.records.filter((r) => !(r.userId === userId && r.roleId === roleId));
    }

    public removeMany(userId: string, roleIds: string[]): void {
        this.records = this.records.filter((r) => !(r.userId === userId && roleIds.includes(r.roleId)));
    }
}
