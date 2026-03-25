import { nanoid } from 'nanoid';
import { seedRole } from '../../role/test/mock-role.db';
import { UserBuilder } from '../user.builder';

interface UserRecord {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

const SEED_DATE = new Date('2024-01-01T00:00:00.000Z');

export const LEGEND_USER_ID = 'mb9NzZCnMCCrWoETc2_DT';
export const LEGEND_USERNAME = 'TheLegend27';

export const theLegend27 = new UserBuilder()
    .withId(LEGEND_USER_ID)
    .withUsername(LEGEND_USERNAME)
    .withRoles([seedRole])
    .build();

export class MockUserDB {
    private users: Record<string, UserRecord>;

    constructor() {
        this.users = {
            [LEGEND_USER_ID]: {
                id: LEGEND_USER_ID,
                username: LEGEND_USERNAME,
                createdAt: SEED_DATE,
                updatedAt: SEED_DATE,
                deletedAt: null,
            },
        };
    }

    public getAll(): UserRecord[] {
        return Object.values(this.users);
    }

    public getById(id: string): UserRecord | null {
        return this.users[id] ?? null;
    }

    public getByUsername(username: string): UserRecord | null {
        return Object.values(this.users).find((u) => u.username === username) ?? null;
    }

    public add(username: string): UserRecord {
        const now = new Date();
        const record: UserRecord = { id: nanoid(), username, createdAt: now, updatedAt: now, deletedAt: null };

        this.users[record.id] = record;
        return record;
    }

    public update(id: string, username: string): UserRecord | null {
        const record = this.users[id];

        if (!record) return null;
        record.username = username;
        record.updatedAt = new Date();

        return record;
    }

    public softDelete(id: string): void {
        const record = this.users[id];

        if (record) {
            record.deletedAt = new Date();
            record.updatedAt = new Date();
        }
    }

    public purge(id: string): void {
        delete this.users[id];
    }
}
