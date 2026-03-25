import { nanoid } from 'nanoid';
import { Role } from './domain/role.model';

export class RoleBuilder {
    private readonly role: Role;

    constructor() {
        const id = nanoid();
        const timestamp = new Date();

        this.role = {
            id: id,
            name: `role-${id}`,
            createdAt: timestamp,
            updatedAt: timestamp,
        };
    }

    public build() {
        return this.role;
    }

    public withId(id: string) {
        this.role.id = id;
        return this;
    }

    public withName(name: string) {
        this.role.name = name;
        return this;
    }

    public withCreatedAt(timestamp: Date) {
        this.role.createdAt = timestamp;
        return this;
    }

    public withUpdatedAt(timestamp: Date) {
        this.role.updatedAt = timestamp;
        return this;
    }
}
