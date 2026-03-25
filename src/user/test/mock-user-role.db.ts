interface UserRoleRecord {
    userId: string;
    roleId: string;
}

export class MockUserRoleDB {
    private records: UserRoleRecord[] = [];

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
}
