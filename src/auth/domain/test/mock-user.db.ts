import { User } from '@/auth-domain';

export class MockUserDB {
    private users: Record<string, User> = {};

    public getAll(): User[] {
        return Object.values(this.users);
    }
}
