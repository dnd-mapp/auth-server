import { config } from '@dotenvx/dotenvx';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
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

async function createUsers() {
    console.log('Creating users...');

    await prisma.user.createMany({
        data: [
            { username: 'CritHitWizard' },
            { username: 'DragonSlayer_88' },
            { username: 'DungeonMasterMind' },
            { username: 'EldritchBlast_v2' },
            { username: 'FumbleFingerBard' },
            { username: 'MysticRogue01' },
            { username: 'Nat20Nomad' },
            { username: 'PaladinOfPizza' },
            { username: 'TheRustyGoblin' },
            { username: 'VorpalBlade_DEV' },
        ],
        skipDuplicates: true,
    });

    console.log('Users created');
}

async function createRoles() {
    console.log('Creating roles...');

    await prisma.role.createMany({
        data: [{ name: 'Super Admin' }, { name: 'Admin' }, { name: 'Player' }, { name: 'Dungeon Master' }],
        skipDuplicates: true,
    });

    console.log('Roles created');
}

async function createPermissions() {
    console.log('Creating permissions...');

    await prisma.permission.createMany({
        data: [
            { name: 'users:create' },
            { name: 'users:read:any' },
            { name: 'users:read:self' },
            { name: 'users:update:any' },
            { name: 'users:update:self' },
            { name: 'users:delete' },
            { name: 'users:purge' },
            { name: 'users:restore' },
            { name: 'permissions:create' },
            { name: 'permissions:read:any' },
            { name: 'permissions:update:any' },
            { name: 'permissions:delete' },
            { name: 'roles:create' },
            { name: 'roles:read:any' },
            { name: 'roles:update:any' },
            { name: 'roles:delete' },
        ],
        skipDuplicates: true,
    });

    console.log('Permissions created');
}

export async function main() {
    console.log('Seeding database...');

    await createUsers();
    await createRoles();
    await createPermissions();
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
