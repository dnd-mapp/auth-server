export const Roles = {
    PLAYER: 'player',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super admin',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
