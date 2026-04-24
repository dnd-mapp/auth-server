import { nanoid } from 'nanoid';

export interface SigningKeyRecord {
    kid: string;
    privateKey: string;
    publicKey: string;
    algorithm: string;
    createdAt: Date;
    revokedAt: Date | null;
}

export class MockSigningKeyDB {
    private keys: Record<string, SigningKeyRecord> = {};

    public getAll(): SigningKeyRecord[] {
        return Object.values(this.keys);
    }

    public getByKid(kid: string): SigningKeyRecord | null {
        return this.keys[kid] ?? null;
    }

    public add(privateKey: string, publicKey: string): SigningKeyRecord {
        const record: SigningKeyRecord = {
            kid: nanoid(),
            privateKey,
            publicKey,
            algorithm: 'RS512',
            createdAt: new Date(),
            revokedAt: null,
        };
        this.keys[record.kid] = record;
        return record;
    }

    public revoke(kid: string): void {
        const record = this.keys[kid];
        if (record) record.revokedAt = new Date();
    }
}
