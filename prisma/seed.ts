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

export async function main() {
    console.log('Seeding database...');
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
