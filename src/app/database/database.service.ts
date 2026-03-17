import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { AppConfig, ConfigurationNamespaces, DatabaseConfig } from '../config/configurations';
import {
    PRISMA_CLIENT,
    PRISMA_CLIENT_OPTIONS,
    PrismaClientCtor,
    PrismaClientOptions,
    PrismaLikeClient,
} from './provide-prisma';

@Injectable()
export class DatabaseService<
    TClient extends PrismaLikeClient = PrismaLikeClient,
    TCtor extends PrismaClientCtor<TClient> = PrismaClientCtor<TClient>,
    TClientOptions extends PrismaClientOptions<TCtor> = PrismaClientOptions<TCtor>,
>
    implements OnModuleInit, OnApplicationShutdown
{
    private readonly configService: ConfigService<AppConfig, true>;
    public get prisma() {
        return this._prisma!;
    }
    private _prisma: TClient | undefined;

    private readonly Client: TCtor;
    private readonly options: TClientOptions;

    constructor(
        @Inject(PRISMA_CLIENT) Client: TCtor,
        @Inject(PRISMA_CLIENT_OPTIONS) options: TClientOptions,
        configService: ConfigService<AppConfig, true>
    ) {
        this.configService = configService;

        this.Client = Client;
        this.options = options;
    }

    public async onModuleInit() {
        this.initializePrisma(this.Client, this.options);
        await this.prisma.$connect();
    }

    public async onApplicationShutdown() {
        await this.prisma.$disconnect();
    }

    private initializePrisma(Client: TCtor, options: TClientOptions) {
        if (this.prisma) return;
        const { host, port, schema, user, password } = this.configService.get<DatabaseConfig>(
            ConfigurationNamespaces.DATABASE
        );

        const adapter = new PrismaMariaDb({
            host: host,
            port: port,
            database: schema,
            user: user,
            password: password,
        });

        this._prisma = new Client({ adapter: adapter, ...options });
    }
}
