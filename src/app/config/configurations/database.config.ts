import { DEFAULT_DB_HOST, DEFAULT_DB_PORT, DEFAULT_DB_SCHEMA, DEFAULT_DB_USER } from '@/app';
import { parseInteger } from '@/shared-utils';
import { registerAs } from '@nestjs/config';
import { EnvironmentVariableNames } from '../validation/environment-variables.schema';
import { ConfigurationNamespaces } from './configuration-namespaces';

export interface DatabaseConfig {
    host: string;
    port: number;
    schema: string;
    user: string;
    password: string;
}

export const databaseConfig = registerAs<DatabaseConfig>(ConfigurationNamespaces.DATABASE, async () => {
    return {
        host: process.env[EnvironmentVariableNames.DB_HOST] ?? DEFAULT_DB_HOST,
        port: parseInteger(DEFAULT_DB_PORT, process.env[EnvironmentVariableNames.DB_PORT]),
        schema: process.env[EnvironmentVariableNames.DB_SCHEMA] ?? DEFAULT_DB_SCHEMA,
        user: process.env[EnvironmentVariableNames.DB_USER] ?? DEFAULT_DB_USER,
        password: process.env[EnvironmentVariableNames.DB_PASSWORD]!,
    };
});
