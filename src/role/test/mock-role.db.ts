import { nanoid } from 'nanoid';

interface RoleRecord {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const SEED_DATE = new Date('2024-01-01T00:00:00.000Z');

export const seedRole: RoleRecord = {
    id: '0UfVIgpN98wqOIi_j7qxF',
    name: 'admin',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
};

export class MockRoleDB {
    private roles: Record<string, RoleRecord>;

    constructor() {
        this.roles = { [seedRole.id]: { ...seedRole } };
    }

    public getAll(): RoleRecord[] {
        return Object.values(this.roles);
    }

    public getById(id: string): RoleRecord | null {
        return this.roles[id] ?? null;
    }

    public getByName(name: string): RoleRecord | null {
        return Object.values(this.roles).find((r) => r.name === name) ?? null;
    }

    public add(name: string): RoleRecord {
        const now = new Date();
        const record: RoleRecord = { id: nanoid(), name, createdAt: now, updatedAt: now };
        this.roles[record.id] = record;
        return record;
    }

    public update(id: string, name: string): RoleRecord | null {
        const record = this.roles[id];
        if (!record) return null;
        record.name = name;
        record.updatedAt = new Date();
        return record;
    }

    public remove(id: string): void {
        delete this.roles[id];
    }
}
