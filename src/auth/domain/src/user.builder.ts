import { nanoid } from 'nanoid';
import { User } from './user.model';

export class UserBuilder {
    private readonly user: User;

    constructor() {
        const id = nanoid();

        this.user = {
            id: id,
            username: `user-${id}`,
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
}
