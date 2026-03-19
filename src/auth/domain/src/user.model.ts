export interface User {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    removedAt: Date | null;
}
