import { nanoid } from 'nanoid';

interface ClientRecord {
    id: string;
    name: string;
    allowedUris: string[];
    createdAt: Date;
    updatedAt: Date;
}

const SEED_DATE = new Date('2024-01-01T00:00:00.000Z');

export const seedClient: ClientRecord = {
    id: 'client-seed-id-0001',
    name: 'dnd-mapp-web',
    allowedUris: ['https://localhost.dndmapp.dev'],
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
};

export class MockClientDB {
    private clients: Record<string, ClientRecord>;

    constructor() {
        this.clients = { [seedClient.id]: { ...seedClient, allowedUris: [...seedClient.allowedUris] } };
    }

    public getAll(): ClientRecord[] {
        return Object.values(this.clients);
    }

    public getById(id: string): ClientRecord | null {
        return this.clients[id] ?? null;
    }

    public getByName(name: string): ClientRecord | null {
        return Object.values(this.clients).find((c) => c.name === name) ?? null;
    }

    public add(name: string, uris: string[] = []): ClientRecord {
        const now = new Date();
        const record: ClientRecord = { id: nanoid(), name, allowedUris: [...uris], createdAt: now, updatedAt: now };

        this.clients[record.id] = record;
        return record;
    }

    public update(id: string, name: string, uris: string[]): ClientRecord | null {
        const record = this.clients[id];

        if (!record) return null;
        record.name = name;
        record.allowedUris = [...uris];
        record.updatedAt = new Date();

        return record;
    }

    public remove(id: string): void {
        delete this.clients[id];
    }
}
