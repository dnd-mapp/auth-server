import { seedPermission } from '@/permission/test';
import { seedRole } from './mock-role.db';

interface RolePermissionRecord {
    roleId: string;
    permissionId: string;
}

export class MockRolePermissionDB {
    private records: RolePermissionRecord[] = [{ roleId: seedRole.id, permissionId: seedPermission.id }];

    public getForRole(roleId: string): RolePermissionRecord[] {
        return this.records.filter((r) => r.roleId === roleId);
    }

    public getByComposite(roleId: string, permissionId: string): RolePermissionRecord | null {
        return this.records.find((r) => r.roleId === roleId && r.permissionId === permissionId) ?? null;
    }

    public add(roleId: string, permissionId: string): RolePermissionRecord {
        const record: RolePermissionRecord = { roleId, permissionId };

        this.records.push(record);
        return record;
    }

    public remove(roleId: string, permissionId: string): void {
        this.records = this.records.filter((r) => !(r.roleId === roleId && r.permissionId === permissionId));
    }

    public removeMany(roleId: string, permissionIds: string[]): void {
        this.records = this.records.filter((r) => !(r.roleId === roleId && permissionIds.includes(r.permissionId)));
    }
}
