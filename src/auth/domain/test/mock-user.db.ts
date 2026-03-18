import { User, UserBuilder } from '@/auth-domain';

export const theLegend27 = new UserBuilder().withId('mb9NzZCnMCCrWoETc2_DT').withUsername('TheLegend27').build();

export class MockUserDB {
    private users: Record<string, User>;

    constructor() {
        this.users = { [theLegend27.id]: theLegend27 };
    }

    public getAll(): User[] {
        return Object.values(this.users);
    }

    public getById(id: string) {
        return this.users[id] ?? null;
    }
}
