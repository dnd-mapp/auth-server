import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseCoreModule } from './database-core.module';
import { DatabaseService } from './database.service';
import { PrismaClientCtor, PrismaClientOptions } from './provide-prisma';

@Module({
    imports: [ConfigModule],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {
    public static forRoot<TClient extends PrismaClientCtor>(
        Client: PrismaClientCtor,
        options?: PrismaClientOptions<TClient>
    ): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [ConfigModule, DatabaseCoreModule.forRoot(Client, options)],
            providers: [DatabaseService],
            exports: [DatabaseService],
        };
    }
}
