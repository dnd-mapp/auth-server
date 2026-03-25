import { nanoid } from 'nanoid';

interface PermissionRecord {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const SEED_DATE = new Date('2024-01-01T00:00:00.000Z');

export const seedPermission: PermissionRecord = {
    id: 'RuKRHK1kBWHIx5m2qwq6R',
    name: 'permission:read',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
};

export class MockPermissionDB {
    private permissions: Record<string, PermissionRecord>;

    constructor() {
        this.permissions = { [seedPermission.id]: { ...seedPermission } };
    }

    public getAll(): PermissionRecord[] {
        return Object.values(this.permissions);
    }

    public getById(id: string): PermissionRecord | null {
        return this.permissions[id] ?? null;
    }

    public getByName(name: string): PermissionRecord | null {
        return Object.values(this.permissions).find((p) => p.name === name) ?? null;
    }

    public add(name: string): PermissionRecord {
        const now = new Date();
        const record: PermissionRecord = { id: nanoid(), name, createdAt: now, updatedAt: now };

        this.permissions[record.id] = record;
        return record;
    }

    public update(id: string, name: string): PermissionRecord | null {
        const record = this.permissions[id];

        if (!record) return null;
        record.name = name;
        record.updatedAt = new Date();

        return record;
    }

    public remove(id: string): void {
        delete this.permissions[id];
    }
}
