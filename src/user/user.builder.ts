import { Role } from '@/role/domain';
import { nanoid } from 'nanoid';
import { User } from './domain/user.model';

export class UserBuilder {
    private readonly user: User;

    constructor() {
        const id = nanoid();
        const timestamp = new Date();

        this.user = {
            id: id,
            username: `user-${id}`,
            roles: [],
            createdAt: timestamp,
            updatedAt: timestamp,
            removedAt: null,
        };
    }

    public build() {
        return this.user;
    }

    public withId(id: string) {
        this.user.id = id;
        return this;
    }

    public withUsername(username: string) {
        this.user.username = username;
        return this;
    }

    public withRoles(roles: Role[]) {
        this.user.roles = roles;
        return this;
    }

    public withCreatedAt(timestamp: Date) {
        this.user.createdAt = timestamp;
        return this;
    }

    public withUpdatedAt(timestamp: Date) {
        this.user.updatedAt = timestamp;
        return this;
    }

    public withRemovedAt(timestamp: Date) {
        this.user.removedAt = timestamp;
        return this;
    }
}
