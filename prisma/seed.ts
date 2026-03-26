import { config } from '@dotenvx/dotenvx';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { nanoid } from 'nanoid';

import { PrismaClient } from './client/client';

config({ path: '.env', quiet: true, ignore: ['MISSING_ENV_FILE'] });

const adapter = new PrismaMariaDb({
    host: process.env['PRISMA_DB_HOST'],
    port: Number.parseInt(process.env['AUTH_SERVER_DB_PORT']!),
    database: process.env['AUTH_SERVER_DB_SCHEMA'],
    user: process.env['PRISMA_DB_USER'],
    password: process.env['PRISMA_DB_PASSWORD'],
});

const prisma = new PrismaClient({ adapter: adapter });

// ---------------------------------------------------------------------------
// Constants — inlined so the seed script is self-contained (no src/ imports)
// ---------------------------------------------------------------------------

const permissionNames = [
    'user:read',
    'user:create',
    'user:update',
    'user:delete',
    'user:purge',
    'user:manage-roles',
    'role:read',
    'role:create',
    'role:update',
    'role:delete',
    'role:manage-permissions',
    'permission:read',
    'permission:create',
    'permission:update',
    'permission:delete',
    'client:read',
    'client:create',
    'client:update',
    'client:delete',
] as const;

const roleNames = ['player', 'admin', 'super admin'] as const;

/** Permissions assigned to each role (zero overlap between roles). */
const rolePermissions: Record<string, string[]> = {
    'player': ['user:read', 'user:update', 'user:delete', 'user:manage-roles'],
    'admin': [
        'user:create',
        'role:read',
        'permission:read',
        'client:read',
        'client:create',
        'client:update',
        'client:delete',
    ],
    'super admin': [
        'user:purge',
        'role:create',
        'role:update',
        'role:delete',
        'role:manage-permissions',
        'permission:create',
        'permission:update',
        'permission:delete',
    ],
};

/** Roles assigned to each user. */
const userRoles: Record<string, string[]> = {
    admin: ['player', 'admin', 'super admin'],
    player: ['player'],
};

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

export async function main() {
    console.log('Seeding database...');

    // 1. Upsert all permissions — build name→id map
    const permissionIds: Record<string, string> = {};

    for (const name of permissionNames) {
        const permission = await prisma.permission.upsert({
            where: { name },
            update: {},
            create: { id: nanoid(), name },
        });

        permissionIds[name] = permission.id;
    }

    console.log(`Upserted ${permissionNames.length} permissions.`);

    // 2. Upsert all roles — build name→id map
    const roleIds: Record<string, string> = {};

    for (const name of roleNames) {
        const role = await prisma.role.upsert({
            where: { name },
            update: {},
            create: { id: nanoid(), name },
        });

        roleIds[name] = role.id;
    }

    console.log(`Upserted ${roleNames.length} roles.`);

    // 3. Upsert RolePermission entries for each role
    for (const [roleName, permissions] of Object.entries(rolePermissions)) {
        const roleId = roleIds[roleName]!;

        for (const permName of permissions) {
            const permissionId = permissionIds[permName]!;

            await prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId, permissionId } },
                update: {},
                create: { roleId, permissionId },
            });
        }
    }

    console.log('Upserted role–permission assignments.');

    // 4. Upsert users — build username→id map
    const userIds: Record<string, string> = {};

    for (const username of Object.keys(userRoles)) {
        const user = await prisma.user.upsert({
            where: { username },
            update: {},
            create: { id: nanoid(), username, password: 'CHANGE_ME' },
        });

        userIds[username] = user.id;
    }

    console.log(`Upserted ${Object.keys(userRoles).length} users.`);

    // 5. Upsert UserRole entries for each user
    for (const [username, roles] of Object.entries(userRoles)) {
        const userId = userIds[username]!;

        for (const roleName of roles) {
            const roleId = roleIds[roleName]!;

            await prisma.userRole.upsert({
                where: { userId_roleId: { userId, roleId } },
                update: {},
                create: { userId, roleId },
            });
        }
    }

    console.log('Upserted user–role assignments.');
}

main()
    .then(async () => {
        console.log('Seeding completed successfully');
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error('Failed to seed database.', error);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
