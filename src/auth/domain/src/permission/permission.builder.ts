import { nanoid } from 'nanoid';
import { Permission } from './permission.model';

export class PermissionBuilder {
    private readonly permission: Permission;

    constructor() {
        const id = nanoid();
        const timestamp = new Date();

        this.permission = {
            id: id,
            name: `permission-${id}:create`,
            createdAt: timestamp,
            updatedAt: timestamp,
        };
    }

    public build() {
        return this.permission;
    }

    public withId(id: string) {
        this.permission.id = id;
        return this;
    }

    public withName(name: string) {
        this.permission.name = name;
        return this;
    }

    public withCreatedAt(timestamp: Date) {
        this.permission.createdAt = timestamp;
        return this;
    }

    public withUpdatedAt(timestamp: Date) {
        this.permission.updatedAt = timestamp;
        return this;
    }
}
