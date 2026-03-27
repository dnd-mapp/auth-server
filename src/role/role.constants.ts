export const Roles = {
    PLAYER: 'Player',
    ADMIN: 'Admin',
    SUPER_ADMIN: 'Super Admin',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
