import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { AppConfig, ConfigurationNamespaces, DatabaseConfig } from '../config/configurations';
import { DatabaseService } from './database.service';
import { PRISMA_CLIENT, PrismaClientCtor, PrismaClientOptions } from './provide-prisma';

// TODO: Remove from global scope

@Module({})
export class DatabaseModule {
    public static forRoot<TClient extends PrismaClientCtor>(
        Client: PrismaClientCtor,
        options?: PrismaClientOptions<TClient>
    ): DynamicModule {
        return {
            global: true,
            module: DatabaseModule,
            providers: [
                {
                    provide: PRISMA_CLIENT,
                    inject: [ConfigService<AppConfig, true>],
                    useFactory: (configService: ConfigService<AppConfig, true>) => {
                        const { host, port, schema, user, password } = configService.get<DatabaseConfig>(
                            ConfigurationNamespaces.DATABASE
                        );

                        const adapter = new PrismaMariaDb({
                            host: host,
                            port: port,
                            database: schema,
                            user: user,
                            password: password,
                        });

                        return new Client({ adapter: adapter, ...options });
                    },
                },
                DatabaseService,
            ],
            exports: [DatabaseService],
        };
    }
}
