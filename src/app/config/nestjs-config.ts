import { validateEnvironmentVariables } from '@dnd-mapp/shared-backend';
import { ConfigModuleOptions } from '@nestjs/config';
import { databaseConfig, securityConfig, serverConfig } from './configurations';
import { EnvironmentVariablesSchema } from './validation/environment-variables.schema';

export const configModuleOptions: ConfigModuleOptions = {
    envFilePath: ['.env'],
    expandVariables: true,
    load: [serverConfig, databaseConfig, securityConfig],
    validate: async (variables) => await validateEnvironmentVariables(EnvironmentVariablesSchema, variables),
};
