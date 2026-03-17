export const PRISMA_CLIENT = Symbol('PRISMA_CLIENT');

export const PRISMA_CLIENT_OPTIONS = Symbol('PRISMA_CLIENT_OPTIONS');

export interface PrismaLikeClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PrismaClientCtor<T extends PrismaLikeClient = PrismaLikeClient> = new (options: any) => T;

export type PrismaClientOptions<TClient extends PrismaClientCtor> = Omit<ConstructorParameters<TClient>[0], 'adapter'>;

export interface PrismaClientConfig<TClient extends PrismaClientCtor, Options extends PrismaClientOptions<TClient>> {
    Client: TClient;
    options: Options;
}
