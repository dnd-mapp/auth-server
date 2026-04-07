import { config } from '@dotenvx/dotenvx';
import { defineConfig } from 'prisma/config';

config({ path: '.env', quiet: true, ignore: ['MISSING_ENV_FILE'] });

const { AUTH_SERVER_DB_USER, AUTH_SERVER_DB_PASSWORD, AUTH_SERVER_DB_HOST, AUTH_SERVER_DB_PORT, AUTH_SERVER_DB_SCHEMA } =
    process.env;
const dbUrl = `mysql://${AUTH_SERVER_DB_USER}:${AUTH_SERVER_DB_PASSWORD}@${AUTH_SERVER_DB_HOST}:${AUTH_SERVER_DB_PORT}/${AUTH_SERVER_DB_SCHEMA}`;

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'tsx prisma/seed.ts',
    },
    datasource: {
        url: dbUrl,
        shadowDatabaseUrl: `${dbUrl}_shadow`,
    },
});
